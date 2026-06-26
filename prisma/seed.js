const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.education.deleteMany();
  await prisma.workExperience.deleteMany();
  await prisma.candidateProfile.deleteMany();
  await prisma.company.deleteMany();
  await prisma.category.deleteMany();
  await prisma.platformSetting.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash("Password123!", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@careercraft.test",
      password,
      role: "ADMIN",
    },
  });

  const recruiter = await prisma.user.create({
    data: {
      name: "Recruiter User",
      email: "recruiter@careercraft.test",
      password,
      role: "RECRUITER",
    },
  });

  const candidate = await prisma.user.create({
    data: {
      name: "Candidate User",
      email: "candidate@careercraft.test",
      password,
      role: "CANDIDATE",
      profile: {
        create: {
          phone: "0771234567",
          location: "Colombo, Sri Lanka",
          bio: "Junior full-stack developer interested in React, Next.js, and UI development.",
          cvUrl: "https://example.com/candidate-cv.pdf",
          skills: {
            create: [
              { name: "HTML" },
              { name: "CSS" },
              { name: "JavaScript" },
              { name: "React" },
              { name: "Next.js" },
            ],
          },
          education: {
            create: [
              {
                school: "Colombo Tech Institute",
                degree: "Diploma in Software Engineering",
                fieldOfStudy: "Web Development",
                startYear: 2023,
                endYear: 2025,
              },
            ],
          },
          workExperience: {
            create: [
              {
                companyName: "Freelance Projects",
                jobTitle: "Junior Web Developer",
                description:
                  "Built small websites using HTML, CSS, JavaScript, and React.",
              },
            ],
          },
        },
      },
    },
  });

  const softwareCategory = await prisma.category.create({
    data: {
      name: "Software Development",
      description: "Jobs related to software engineering and web development.",
    },
  });

  const designCategory = await prisma.category.create({
    data: {
      name: "Design",
      description: "Jobs related to UI, UX, and product design.",
    },
  });

  const companyOne = await prisma.company.create({
    data: {
      name: "TechNova Solutions",
      description: "A technology company building modern web applications.",
      website: "https://example.com",
      location: "Colombo",
      recruiterId: recruiter.id,
    },
  });

  const companyTwo = await prisma.company.create({
    data: {
      name: "Creative Labs",
      description: "A design-focused company working with digital products.",
      website: "https://example.com",
      location: "Remote",
      recruiterId: recruiter.id,
    },
  });

  const frontendJob = await prisma.job.create({
    data: {
      title: "Frontend Developer",
      description:
        "We are looking for a frontend developer to build responsive and user-friendly web interfaces.",
      requirements:
        "HTML, CSS, JavaScript, React, Tailwind CSS, and basic Git knowledge.",
      location: "Colombo",
      salary: "LKR 120,000 - 180,000",
      type: "FULL_TIME",
      companyId: companyOne.id,
      categoryId: softwareCategory.id,
      recruiterId: recruiter.id,
    },
  });

  const designerJob = await prisma.job.create({
    data: {
      title: "UI/UX Designer",
      description:
        "We need a creative UI/UX designer to design clean and modern application screens.",
      requirements:
        "Figma, wireframing, user research, design systems, and communication skills.",
      location: "Remote",
      salary: "LKR 90,000 - 140,000",
      type: "CONTRACT",
      companyId: companyTwo.id,
      categoryId: designCategory.id,
      recruiterId: recruiter.id,
    },
  });

  await prisma.job.create({
    data: {
      title: "Junior Full Stack Developer",
      description:
        "A beginner-friendly full-stack developer role using Next.js and PostgreSQL.",
      requirements:
        "JavaScript, React, Next.js, PostgreSQL, Prisma, and willingness to learn.",
      location: "Kandy",
      salary: "LKR 100,000 - 160,000",
      type: "FULL_TIME",
      companyId: companyOne.id,
      categoryId: softwareCategory.id,
      recruiterId: recruiter.id,
    },
  });

  await prisma.application.create({
    data: {
      candidateId: candidate.id,
      jobId: frontendJob.id,
      coverLetter:
        "I am interested in this frontend developer position and I am ready to learn and contribute.",
      status: "APPLIED",
    },
  });

  await prisma.application.create({
    data: {
      candidateId: candidate.id,
      jobId: designerJob.id,
      coverLetter:
        "I have basic design experience and would like to improve my UI/UX skills.",
      status: "INTERVIEW",
    },
  });

  await prisma.platformSetting.createMany({
    data: [
      {
        key: "platformName",
        value: "Career Craft",
      },
      {
        key: "allowRecruiterRegistration",
        value: "true",
      },
    ],
  });

  console.log("Seed completed successfully.");
  console.log("Test login accounts:");
  console.log("Admin: admin@careercraft.test / Password123!");
  console.log("Recruiter: recruiter@careercraft.test / Password123!");
  console.log("Candidate: candidate@careercraft.test / Password123!");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });