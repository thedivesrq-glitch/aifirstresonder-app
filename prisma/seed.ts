/**
 * Optional seed script — run with: npm run db:seed
 * Creates a few sample posts for demo purposes.
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clear existing data
  await prisma.platformPost.deleteMany()
  await prisma.post.deleteMany()

  // Sample 1: Draft post
  await prisma.post.create({
    data: {
      title: 'Q1 Product Launch',
      content: "Excited to announce our biggest product update yet! 🚀 We've rebuilt the core engine from scratch, making everything 10× faster. Check it out at our website. #ProductLaunch #Innovation",
      platforms: JSON.stringify(['twitter', 'linkedin', 'instagram']),
      status: 'DRAFT',
      hashtags: JSON.stringify(['ProductLaunch', 'Innovation', 'Tech']),
      tone: 'professional',
      topic: 'Product launch announcement',
      aiGenerated: true,
      platformPosts: {
        create: [
          {
            platform: 'twitter',
            content: "Biggest update yet! 🚀 10× faster, rebuilt from scratch. Try it now → [link] #ProductLaunch",
            status: 'DRAFT',
          },
          {
            platform: 'linkedin',
            content: "We're thrilled to announce our Q1 2026 product launch. After 6 months of engineering work, we've completely rebuilt our core engine — delivering 10× performance improvements.\n\nKey highlights:\n• 10× faster processing\n• 40% reduction in memory usage\n• Zero-downtime migration path\n\nWe couldn't be more proud of what our team built. Read the full announcement on our blog.\n\n#ProductLaunch #Engineering #Innovation",
            status: 'DRAFT',
          },
          {
            platform: 'instagram',
            content: "The wait is over. 🚀\n\nOur biggest update of 2026 is live — 10× faster, rebuilt from the ground up.\n\nSwipe to see what changed, and tap the link in bio to try it today.\n\n#ProductLaunch #Tech #Innovation #Startup #Engineering #NewRelease #SaaS",
            status: 'DRAFT',
          },
        ],
      },
    },
  })

  // Sample 2: Scheduled post
  const scheduledDate = new Date()
  scheduledDate.setDate(scheduledDate.getDate() + 2)
  scheduledDate.setHours(9, 0, 0, 0)

  await prisma.post.create({
    data: {
      title: 'Customer Success Story',
      content: "How @AcmeCorp reduced onboarding time by 60% using our platform. A case study worth reading. 📊",
      platforms: JSON.stringify(['twitter', 'linkedin']),
      status: 'SCHEDULED',
      scheduledAt: scheduledDate,
      hashtags: JSON.stringify(['CustomerSuccess', 'CaseStudy', 'B2B']),
      tone: 'professional',
      topic: 'Customer success case study',
      aiGenerated: false,
      platformPosts: {
        create: [
          {
            platform: 'twitter',
            content: "How @AcmeCorp cut onboarding time by 60% with our platform 📊 Full case study → [link] #CustomerSuccess",
            status: 'SCHEDULED',
          },
          {
            platform: 'linkedin',
            content: "Proud to share how AcmeCorp transformed their customer onboarding with our platform.\n\nThe results speak for themselves:\n✅ 60% reduction in onboarding time\n✅ 45% increase in activation rate\n✅ NPS score up 32 points\n\nRead the full case study → [link]\n\n#CustomerSuccess #CaseStudy #B2B #Growth",
            status: 'SCHEDULED',
          },
        ],
      },
    },
  })

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
