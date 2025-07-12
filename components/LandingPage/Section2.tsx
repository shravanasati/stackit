"use client";

import DottedCard from "@/components/DottedCard";
import { MessageSquare, ShieldCheck, Users } from "lucide-react";
import { motion } from "framer-motion";

function Section2() {
  const gridItems = [
    {
      color: "blue",
      lucideIcon: MessageSquare,
      title: "Q&A Hub",
      description: "Ask questions and get answers from experts.",
    },
    {
      color: "yellow",
      lucideIcon: ShieldCheck,
      title: "Trusted Community",
      description: "Quality answers, peer moderation, and safe environment.",
    },
    {
      color: "purple",
      lucideIcon: Users,
      title: "Collaborative",
      description: "Connect, discuss, and solve problems together.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 50,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

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

  return (
    <section className="min-h-[85vh] w-full py-16 px-4 flex flex-col items-center justify-between">
      <div className="max-w-6xl w-full mx-auto">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-12 text-primary"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={titleVariants}
        >
          Why use StackIt?
        </motion.h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {gridItems.map((item, index) => (
            <motion.div key={index} variants={itemVariants}>
              <DottedCard
                color={item.color}
                lucideIcon={item.lucideIcon}
                title={item.title}
                description={item.description}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Section2;
