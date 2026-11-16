"use client";

import Copy from "@/shared/ui/Copy/Copy";

import "./PageTitle.css";

export default function PageTitle({ subheader, title, delay = 0.5 }) {
  return (
    <section className="page-title">
      <div className="title-stack page-title-titles">
        <Copy animateOnScroll={false} delay={delay}>
          <p className="subheader">{subheader}</p>
        </Copy>
        <Copy animateOnScroll={false} delay={delay}>
          <h1>{title}</h1>
        </Copy>
      </div>
    </section>
  );
}
