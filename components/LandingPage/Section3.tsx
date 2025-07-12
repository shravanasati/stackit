"use client";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { motion } from "framer-motion";

const testimonials = [
  {
    quote:
      "Ask programming questions and get answers from a global community of developers, just like StackOverflow.",
    name: "Q&A Boards",
    src: "/parallax/questions.jpg",
  },
  {
    quote:
      "Share your expertise by answering questions and helping others solve coding challenges.",
    name: "Expert Answers",
    src: "/parallax/answers.jpg",
  },
  {
    quote:
      "Upvote helpful answers and questions to highlight the best solutions for everyone.",
    name: "Voting System",
    src: "/parallax/voting.jpg",
  },
  {
    quote:
      "Earn reputation points and badges for your valuable contributions to the community.",
    name: "Reputation & Badges",
    src: "/parallax/reputation.jpg",
  },
  {
    quote: "Get notified when someone responds to your questions or comments.",
    name: "Notifications",
    src: "/parallax/notifications.jpg",
  },
];

const titleVariants = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function Section3() {
  return (
    <div className="min-h-[80vh]">
      <motion.h2
        className="text-4xl md:text-5xl font-bold text-center  mt-4 -mb-12 md:mb-0 text-primary"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={titleVariants}
      >
        StackIt offers...
      </motion.h2>
      <AnimatedTestimonials testimonials={testimonials} autoplay={true} />
    </div>
  );
}
