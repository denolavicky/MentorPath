import User from "../models/User.js";

// @route POST /api/mentors/apply
export const applyToMentor = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.mentorStatus === "approved") {
      return res.status(400).json({ message: "You are already an approved mentor." });
    }
    if (user.mentorStatus === "pending") {
      return res.status(400).json({ message: "Your application is already under review." });
    }

    const { headline, field, company, jobTitle, yearsExperience, skills, bio, sessionPrice, availability, whyMentor, helpWith, linkedIn, website, country, languages } = req.body;

    if (!field || !company || !jobTitle || !bio) {
      return res.status(400).json({ message: "Please fill in all required fields." });
    }

    await User.findByIdAndUpdate(req.user._id, {
      mentorStatus: "pending",
      bio,
      careerField: field,
      skills: skills || [],
      sessionPrice: sessionPrice || 0,
      experience: yearsExperience || "",
      linkedIn: linkedIn || "",
      website: website || "",
      expertise: helpWith || [],
      // Store application data
      applicationData: {
        headline,
        company,
        jobTitle,
        availability,
        whyMentor,
        country,
        languages,
        appliedAt: new Date(),
      },
    });

    res.json({ message: "Application submitted successfully." });
  } catch (error) {
    console.error("Apply mentor error:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// @route GET /api/mentors — get all approved mentors
export const getAllMentors = async (req, res) => {
  try {
    const { field, minPrice, maxPrice, search } = req.query;

    const query = { role: "mentor", mentorStatus: "approved" };

    if (field) query.careerField = field;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { careerField: { $regex: search, $options: "i" } },
        { skills: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const mentors = await User.find(query).select("-password -applicationData");
    res.json({ mentors });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @route GET /api/mentors/:id
export const getMentorById = async (req, res) => {
  try {
    const mentor = await User.findById(req.params.id).select("-password -applicationData");
    if (!mentor || mentor.role !== "mentor") {
      return res.status(404).json({ message: "Mentor not found" });
    }
    res.json({ mentor });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @route GET /api/mentors/application/status
export const getApplicationStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("mentorStatus");
    res.json({ mentorStatus: user.mentorStatus });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
