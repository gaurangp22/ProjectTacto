/**
 * Open roles, matching the "We're Hiring" posters. Edit this list to add, change or
 * close positions: the careers page and the application API both read from it.
 * Set `open: false` to hide a role.
 *
 * All roles are currently internships. `INTERNSHIP_TERMS` is shown on every page.
 */
export interface Perk {
  title?: string;
  body: string;
}

export interface Job {
  slug: string;
  title: string;
  team: Team;
  location: string;
  open: boolean;
  /** One-line tagline, shown in the list and under the title. */
  summary: string;
  /** "What you'll bring" */
  bring: string[];
  /** "Why you'll love it" */
  perks: Perk[];
  /** The highlighted reassurance line. */
  note: string;
  /** What to send, shown on the "show us your work" question. */
  showUs: string;
}

export const INTERNSHIP_TERMS = {
  pay: "Unpaid for now",
  commitment: "Part-time, flexible",
  hours: "About 8–12 hours a week",
  duration: "3 months, with the option to extend",
  location: "Remote",
};

export const CONTACT_EMAIL = "hello@projecttacto.org";

export const TEAMS = ["Hardware", "Research", "Partnerships", "Curriculum", "Marketing"] as const;
export type Team = (typeof TEAMS)[number];

export const JOBS: Job[] = [
  {
    slug: "embedded-hardware-engineer",
    title: "Embedded Systems & Hardware Engineer",
    team: "Hardware",
    location: "Remote",
    open: true,
    summary: "Build technology that makes coding possible beyond screens.",
    bring: [
      "Hands-on experience with microcontrollers (ESP32, STM32 or similar), embedded C/C++ and electronics prototyping.",
      "An interest in NFC/RFID, circuit design, sensors and developing reliable hardware systems.",
      "A problem-solving mindset and the curiosity to turn ambitious ideas into working prototypes.",
    ],
    perks: [
      { title: "Build something real", body: "Help develop an innovative tactile coding device from the ground up." },
      { title: "Own your work", body: "Contribute to hardware architecture, prototyping and product development." },
      { title: "Go beyond the classroom", body: "Explore research, engineering challenges and opportunities to showcase your work." },
    ],
    note: "We value builders, not just qualifications. Students, makers and early-career engineers are welcome.",
    showUs: "Your resume, GitHub, hardware projects or anything you've built that you're proud of.",
  },
  {
    slug: "accessibility-research-lead",
    title: "Accessibility Research Lead",
    team: "Research",
    location: "Remote",
    open: true,
    summary: "Help shape technology around the people who actually use it.",
    bring: [
      "Experience or a strong interest in accessibility, human-computer interaction, user research or inclusive education.",
      "The ability to conduct thoughtful research, gather feedback and translate insights into product improvements.",
      "Empathy, curiosity and an interest in working with visually impaired learners, educators and accessibility communities.",
    ],
    perks: [
      { title: "Make research matter", body: "Help ensure that accessibility is built into every stage of our product." },
      { title: "Shape real decisions", body: "Your findings will help guide how TACTO is designed, tested and improved." },
      { title: "Explore meaningful research", body: "Contribute to accessibility studies, human-centred design and potential academic publications." },
    ],
    note: "You don't need years of research experience. We value curiosity, empathy and the willingness to learn.",
    showUs: "Your resume, research work, portfolio or anything that reflects your interest in accessibility.",
  },
  {
    slug: "partnerships-manager",
    title: "Government & NGO Partnerships Manager",
    team: "Partnerships",
    location: "Remote",
    open: true,
    summary: "Help bring accessible technology from our lab to the classrooms that need it.",
    bring: [
      "Strong communication, networking and relationship-building skills.",
      "An interest in government initiatives, NGOs, CSR partnerships, social entrepreneurship or education policy.",
      "The confidence to approach organisations, present ideas and turn meaningful conversations into collaborations.",
    ],
    perks: [
      { title: "Create real-world impact", body: "Help connect TACTO with schools, NGOs and organisations working in inclusive education." },
      { title: "Build meaningful relationships", body: "Engage with institutions, educators and potential partners across the accessibility ecosystem." },
      { title: "Drive our growth", body: "Take ownership of outreach initiatives and help develop partnerships that bring our mission closer to reality." },
    ],
    note: "You don't need an impressive network to start. We value initiative, communication and the ability to build relationships.",
    showUs: "Your resume, relevant experience, or a short note about why you'd like to join TACTO.",
  },
  {
    slug: "curriculum-designer",
    title: "Curriculum & Pedagogy Designer",
    team: "Curriculum",
    location: "Remote",
    open: true,
    summary: "Rethink how programming is taught, one tactile challenge at a time.",
    bring: [
      "A passion for education, curriculum development, creative teaching or accessible learning experiences.",
      "An ability to simplify programming concepts and transform them into engaging, hands-on activities.",
      "An interest in inclusive pedagogy, special education, computational thinking or educational technology.",
    ],
    perks: [
      { title: "Reimagine coding education", body: "Help design tactile learning activities that introduce programming concepts beyond traditional screens." },
      { title: "Build something from scratch", body: "Shape lessons, challenges and learning experiences for an entirely new approach to coding." },
      { title: "Bridge technology and education", body: "Collaborate with engineers and researchers to turn innovative hardware into meaningful learning experiences." },
    ],
    note: "Great ideas don't require years of teaching experience. Educators, students and creative thinkers are welcome.",
    showUs: "Your resume, lesson plans, educational projects or any creative work you're proud of.",
  },
  {
    slug: "social-media-manager-intern",
    title: "Social Media Manager Intern",
    team: "Marketing",
    location: "Remote",
    open: true,
    summary: "Tell stories that deserve to be heard. Build a brand that matters.",
    bring: [
      "A creative eye for content, storytelling and social media trends.",
      "Experience or interest in Instagram, LinkedIn, reels, copywriting and content creation.",
      "The ability to turn ideas, milestones and behind-the-scenes moments into engaging content.",
    ],
    perks: [
      { body: "Help shape the voice and identity of an ambitious accessibility-tech startup." },
      { body: "Own creative campaigns and build a portfolio of meaningful, real-world work." },
      { body: "Work closely with the founding team, pitch fresh ideas and see them come to life." },
    ],
    note: "Your creativity matters more than your follower count. Students and early-career creators are welcome.",
    showUs: "Your resume, portfolio, social media work or anything you've created that you're proud of.",
  },
];

export const openJobs = () => JOBS.filter((j) => j.open);
export const jobBySlug = (slug: string) => JOBS.find((j) => j.slug === slug && j.open);

/** Max CV size accepted by the API (bytes, before base64). */
export const MAX_CV_BYTES = 2 * 1024 * 1024;
export const CV_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"] as const;
