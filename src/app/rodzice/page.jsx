"use client";

import ParentsAccordion from "@/components/ParentsAccordion/ParentsAccordion";
import { PARENTS } from "@/data/kennel";

export default function ParentsPage() {
  return <ParentsAccordion parents={PARENTS} />;
}
