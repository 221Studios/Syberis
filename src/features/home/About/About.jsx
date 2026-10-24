"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Copy from "@/shared/ui/Copy/Copy";
import ScrollVideo from "../ScrollVideo/ScrollVideo";
import { PARENTS } from "@/data/kennel";

import "./About.css";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const aboutRef = useRef(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray(".about-service-card");
      if (!cards.length) return;

      gsap.set(cards, { y: 300, opacity: 0 });

      gsap.to(cards, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: ".about-services-grid",
          start: "top 85%",
          once: true,
        },
      });
    },
    { scope: aboutRef },
  );

  return (
    <section className="about" ref={aboutRef}>
      <div className="container">
        <div className="about-wrapper">
          <div className="about-intro">
            <Copy variant="flicker">
              <p className="mono about-label">[ O hodowli ]</p>
            </Copy>

            <Copy splitType="words">
              <h5 className="v2 about-title">
                Domowa hodowla psów rasy Siberian Husky, prowadzona z ogromnej
                miłości i fascynacji tymi pięknymi psami północy.
              </h5>
            </Copy>
          </div>

          <div className="about-services">
            <div className="about-services-left">
              <div className="about-services-left-header">
                <Copy splitType="words">
                  <h6 className="v2">
                    Nasze psy są pełnoprawnymi członkami rodziny.
                  </h6>
                </Copy>
              </div>

              <div className="about-services-left-copy">
                <ScrollVideo
                  framesPath="/media/bieg-frames"
                  frameCount={100}
                  className="about-services-image"
                />

                <p className="about-services-copy">
                  Dlatego od pierwszych chwil życia szczenięta są otoczone naszą
                  miłością, uwagą i stałą opieką.
                </p>
              </div>
            </div>

            <div className="about-services-right">
              <Copy splitType="words">
                <h6 className="v2">Rodzice</h6>
              </Copy>

              <div className="about-services-grid">
                {PARENTS.map((parent, id) => {
                  const homePhoto = parent.homePhoto ?? parent.photo;
                  const homePhotoStyle =
                    parent.homePhotoPosition || parent.homePhotoScale
                      ? {
                          objectPosition: parent.homePhotoPosition,
                          "--parent-photo-scale": parent.homePhotoScale,
                          "--parent-photo-x": parent.homePhotoOffsetX,
                          "--parent-photo-y": parent.homePhotoOffsetY,
                        }
                      : undefined;

                  return (
                    <Link
                      href="/rodzice"
                      className="about-service-card"
                      key={parent.slug}
                    >
                      <p className="mono sm">0{id + 1}</p>
                      {homePhoto ? (
                        <div className="about-service-photo">
                          <img
                            src={homePhoto}
                            alt={parent.name}
                            style={homePhotoStyle}
                          />
                        </div>
                      ) : null}
                      <p className="md about-parent-name">{parent.name}</p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
