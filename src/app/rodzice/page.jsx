"use client";

import ParentsAccordion from "@/features/parents/ParentsAccordion/ParentsAccordion";
import { PARENTS } from "@/data/kennel";

export default function ParentsPage() {
  return <ParentsAccordion parents={PARENTS} />;
}
