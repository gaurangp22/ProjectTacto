/** Field testimonials (verbatim from the original site). */
export interface Testimonial {
  quote: string;
  name: string;
  role: "Academia" | "Technology" | "Learner" | "NGO" | "Educator" | "Finance" | "Recognition";
  title: string;
  initial: string;
}

export const TESTIMONIALS: Testimonial[] = [
              {
                quote: "Even as a prototype, the systems-thinking is clear. The hardware, the pedagogy, and the deployment model are designed as one coherent unit. That kind of discipline is rare in early-stage projects, and I am genuinely excited to see where this goes as they scale.",
                name: 'Siddharth Pant',
                role: 'Technology',
                title: 'Associate Director, Accenture',
                initial: 'SP',
              },
              {
                quote: "The loop block has this circular ridge on top. I can feel it is different from the if-block, which has a sharp corner with a notch. I placed the loop next to the play-note block and the speaker said 'repeat play note C three times.' Then I changed the number slot to five and it played the note five times. I built four music programs in one session. My teacher said the prototype will get even more sound blocks soon and I can try nested loops next time.",
                name: 'Aarav, age 9',
                role: 'Learner',
                title: 'Visually impaired pilot participant, Northern India',
                initial: 'A',
              },
              {
                quote: "Accessible education tools often focus on one region or one language. Even at the prototype stage, Tacto is architecturally ready for multilingual deployment. That matters enormously for the communities we work with globally.",
                name: 'Devashish Pandey',
                role: 'NGO',
                title: 'Country Coordinator India, ASED Action Solidaire',
                initial: 'DP',
              },
              {
                quote: "I teach a mixed class of twelve children, some visually impaired and some sighted, aged 7 to 13. Before the Tacto prototype arrived, I would spend the entire period describing what is on the screen. 'Now the cursor is here, now drag this block there.' With the prototype, I handed out the blocks, explained the shapes once, and within twenty minutes three students had independently built a sequence that played a repeating melody. One of them, who usually sits quietly in the back, asked if she could stay during lunch to try the conditional block. In fifteen years I have never had a student ask to skip lunch for a lesson. And it is still just a prototype.",
                name: 'Sunita R.',
                role: 'Educator',
                title: 'Special educator, 15 yrs experience with VI learners',
                initial: 'SR',
              },
              {
                quote: "As someone building immersive learning products, I can say Tacto solves a real gap. The NFC-based approach is cost-effective and elegant. Even in its current prototype form, this is exactly what schools in tier-2 and tier-3 cities need.",
                name: 'Abhishek Jha',
                role: 'Technology',
                title: 'CEO, SchoolVR and AONIX PVT LTD',
                initial: 'AJ',
              },
              {
                quote: "I am not visually impaired but my teacher let our whole class try the Tacto prototype. I closed my eyes and tried to build a program using just touch and the audio. I snapped an if-block onto the grid and it immediately said 'if button pressed, then play drum sound.' I swapped it for a while-loop and it said 'while button pressed, repeat drum sound.' I understood the difference between if and while in five minutes just by feeling the block shapes and listening. My friend who is visually impaired was faster than me because she is better at reading the Braille labels.",
                name: 'Diya, age 11',
                role: 'Learner',
                title: 'Sighted pilot participant, Western India',
                initial: 'D',
              },
              {
                quote: "We work with underserved women and children across Rajasthan. A tool like Tacto that requires no screen literacy and can function in low-infrastructure settings is exactly the kind of intervention we look for. The fact that it is still a prototype and already this functional gives me confidence in where it is headed.",
                name: 'Rakesh Kumar Kaushik',
                role: 'NGO',
                title: 'Director, Rajasthan Mahila Kalyan Mandal',
                initial: 'RK',
              },
              {
                quote: "I have evaluated over thirty assistive technology products in my career. Most of them take an existing visual tool and add audio narration on top. The child is still navigating someone else's interface. Tacto is the first system I have seen where the interface itself is tactile-first. The Braille labels, the distinct block shapes, the magnetic snap feedback. Every design decision assumes the user cannot see, and that changes everything. During our evaluation of the prototype, we had children debugging each other's programs by touch alone. That is not something I expected to see from an early-stage product.",
                name: 'Manoj K.',
                role: 'Educator',
                title: 'Assistive technology evaluator, 12 yrs in rehabilitation',
                initial: 'MK',
              },
              {
                quote: "From a product standpoint, even at the prototype stage, the unit economics are sound and the open-hardware model creates a defensible ecosystem play. This is how you build lasting infrastructure for inclusion.",
                name: 'Saurabh Pant',
                role: 'Finance',
                title: 'Former Vice President, Morgan Stanley',
                initial: 'SP',
              },
              {
                quote: "My favourite block is the variable block. It has two slots, one for the name and one for the value. I made a variable called 'pitch' and set it to a low note, then put it inside a loop that pitches it up each time. The speaker played the notes going higher and higher. My teacher said the prototype only has eight block types right now but more are coming. I showed my older brother and he said he did not learn variables until class 8. I am in class 3. I want to make a whole song when the new blocks come out.",
                name: 'Riya, age 8',
                role: 'Learner',
                title: 'Visually impaired pilot participant, Southern India',
                initial: 'R',
              },
              {
                quote: "Project TACTO demonstrates a rare combination of technical rigour and genuine social impact. What stands out most about this prototype is the completeness of its vision - it doesn't just solve a small part of the accessibility problem, it reimagines the entire foundation of how computational thinking is taught.",
                name: 'Dr. Kalyan K',
                role: 'Academia',
                title: 'Chairperson, IET Hyderabad Section',
                initial: 'KK',
              },
              {
                quote: "Winner of the Engineering Resilience Award. Recognized for demonstrating exceptional technical rigour and genuine social impact in making STEM education accessible for visually impaired learners.",
                name: 'Engineering Resilience Award',
                role: 'Recognition',
                title: 'Awarded by IET Hyderabad',
                initial: "award",
              },
            ];

export const DISCLAIMER =
  "* Learner and educator testimonials are representative composites based on pilot session observations. Names and details have been changed. Endorser quotes are reproduced with permission.";
