import Roadmap from "../models/Roadmap.js";

// @route GET /api/roadmaps
export const getAllRoadmaps = async (req, res) => {
  try {
    const { field, level } = req.query;
    const query = { published: true };
    if (field) query.field = field;
    if (level) query.level = level;
    const roadmaps = await Roadmap.find(query)
      .populate("mentor", "name avatar careerField")
      .sort({ saves: -1 });
    res.json({ roadmaps });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @route GET /api/roadmaps/:id
export const getRoadmapById = async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id).populate("mentor", "name avatar careerField sessionPrice");
    if (!roadmap) return res.status(404).json({ message: "Roadmap not found" });
    res.json({ roadmap });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @route POST /api/roadmaps
export const createRoadmap = async (req, res) => {
  try {
    const { title, description, field, level, duration, tags, steps } = req.body;
    if (!title || !description || !field) {
      return res.status(400).json({ message: "Title, description and field are required" });
    }
    const roadmap = await Roadmap.create({
      mentor: req.user._id, title, description, field,
      level: level || "Beginner", duration, tags: tags || [], steps: steps || [],
    });
    const populated = await Roadmap.findById(roadmap._id).populate("mentor", "name avatar");
    res.status(201).json({ roadmap: populated });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @route PUT /api/roadmaps/:id
export const updateRoadmap = async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id);
    if (!roadmap) return res.status(404).json({ message: "Roadmap not found" });
    if (roadmap.mentor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    const updated = await Roadmap.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ roadmap: updated });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @route DELETE /api/roadmaps/:id
export const deleteRoadmap = async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id);
    if (!roadmap) return res.status(404).json({ message: "Roadmap not found" });
    if (roadmap.mentor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await roadmap.deleteOne();
    res.json({ message: "Roadmap deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
