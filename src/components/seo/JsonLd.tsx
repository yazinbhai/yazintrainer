import React from "react";

export function JsonLd() {
  const schemaGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://yazintrainer.com/#website",
        "url": "https://yazintrainer.com",
        "name": "Yazin Trainer",
        "description": "Premium Soft Skills, Communicative English & IELTS Training for Corporates and Institutions by Yazin T. Azad.",
        "publisher": {
          "@id": "https://yazintrainer.com/#organization"
        },
        "inLanguage": "en-US"
      },
      {
        "@type": "Person",
        "@id": "https://yazintrainer.com/#person",
        "name": "Yazin T. Azad",
        "jobTitle": "Master Soft Skills & IELTS Trainer, Communication Strategist",
        "description": "Master Soft Skills, TEFL, TESOL, and IELTS Certified Trainer specializing in corporate communication strategy, executive coaching, and institutional placement readiness.",
        "url": "https://yazintrainer.com",
        "image": "https://yazintrainer.com/Yazin_professional.png",
        "email": "consult@yazintrainer.com",
        "knowsAbout": [
          "Corporate Soft Skills Training",
          "Executive Communication Strategy",
          "IELTS Band 7.5+ Preparation",
          "TEFL / TESOL Pedagogy",
          "Institutional Job-Readiness",
          "Adult Learning & Facilitation Methodology"
        ],
        "hasCredential": [
          {
            "@type": "EducationalOccupationalCredential",
            "credentialCategory": "degree",
            "name": "Masters in Human Resource Management"
          },
          {
            "@type": "EducationalOccupationalCredential",
            "credentialCategory": "certificate",
            "name": "Certified Master Soft Skills Trainer"
          },
          {
            "@type": "EducationalOccupationalCredential",
            "credentialCategory": "certificate",
            "name": "Certified IELTS, TEFL & TESOL Trainer",
            "recognizedBy": [
              { "@type": "Organization", "name": "IDP Education" },
              { "@type": "Organization", "name": "British Council" },
              { "@type": "Organization", "name": "ALAP (Accreditation Language Services)" },
              { "@type": "Organization", "name": "University of Arizona" }
            ]
          }
        ],
        "worksFor": {
          "@id": "https://yazintrainer.com/#organization"
        }
      },
      {
        "@type": ["ProfessionalService", "EducationalOrganization"],
        "@id": "https://yazintrainer.com/#organization",
        "name": "Yazin Trainer",
        "url": "https://yazintrainer.com",
        "logo": "https://yazintrainer.com/yazin-trainer-logo.png",
        "image": "https://yazintrainer.com/Yazin_professional.png",
        "founder": {
          "@id": "https://yazintrainer.com/#person"
        },
        "email": "consult@yazintrainer.com",
        "description": "Premium communication strategy, soft skills mastery, and high-stakes English training for corporates and academic institutions.",
        "priceRange": "$$$",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "IN"
        },
        "areaServed": ["India", "Global Remote"],
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Communication & Soft Skills Interventions",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Corporate Communication Strategy",
                "description": "Executive coaching, internal alignment, and public speaking mastery for senior leaders and corporate teams."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Institutional Job-Readiness for Corporate Placements",
                "description": "Structured interventions for higher education institutions bridging academic knowledge and corporate expectations."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Course",
                "name": "Premium English Communication and IELTS Mastery",
                "description": "High-stakes IELTS preparation engineered for absolute certainty, targeting Band 7.5+ strategies.",
                "provider": {
                  "@id": "https://yazintrainer.com/#organization"
                }
              }
            }
          ]
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://yazintrainer.com/#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://yazintrainer.com"
          }
        ]
      },
      {
        "@type": "HowTo",
        "@id": "https://yazintrainer.com/#methodology",
        "name": "Yazin Trainer 4-Phase Intervention Framework",
        "description": "Proprietary methodology to transform individual and organizational communication through structured behavioral training.",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Diagnostic Assessment",
            "text": "Deep-dive analysis of current communication gaps, behavioral patterns, and corporate/academic requirements."
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "Curriculum Architecture",
            "text": "Designing a bespoke intervention program leveraging TEFL methodologies and adult-learning principles."
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Strategic Delivery",
            "text": "Interactive, scenario-based training sessions focused on practical application, not just theory."
          },
          {
            "@type": "HowToStep",
            "position": 4,
            "name": "Metric Measurement",
            "text": "Continuous evaluation mapping behavioral shifts and ROI against the initial diagnostic baselines."
          }
        ]
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
    />
  );
}
