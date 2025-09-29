// File: seed-test-db.js
// Place this file in: C:\The-Almagest-Project\yoohooguru\seed-test-db.js

const admin = require("firebase-admin");
const { initializeApp, applicationDefault } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

initializeApp({
  credential: applicationDefault(),
});

const db = getFirestore();

async function seed() {
  console.log("🚀 Seeding Firebase test database...");

  const users = [
    { id: "uid-1", name: "Jane Angel", email: "angel@example.com" },
    { id: "uid-2", name: "Tom Applicant", email: "tom@example.com" },
    { id: "uid-3", name: "Dana Duplicate", email: "dana@example.com" },
    { id: "uid-4", name: "Nina NonOwner", email: "nina@example.com" },
  ];
  for (const user of users) {
    await db.collection("Users").doc(user.id).set(user, { merge: true });
  }

  const now = new Date();
  const jobs = [
    {
      id: "job-1",
      title: "Childcare in JC",
      description: "Help with childcare 2x a week",
      posterId: "uid-1",
      location: "Johnson City, TN",
      isFeatured: true,
      createdAt: now,
      tags: ["childcare", "evening"]
    },
    {
      id: "job-2",
      title: "Tech Help Needed",
      description: "Fix my computer",
      posterId: "uid-1",
      location: "Bristol, TN",
      isFeatured: false,
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 40),
      tags: ["tech", "computer"]
    },
    {
      id: "job-3",
      title: "Gardening Assistance",
      description: "Weed and plant flowers",
      posterId: "uid-1",
      location: "Kingsport, TN",
      isFeatured: false,
      createdAt: new Date(now.getTime() - 1000 * 60 * 60),
      tags: ["gardening"]
    }
  ];
  for (const job of jobs) {
    await db.collection("Jobs").doc(job.id).set(job, { merge: true });
  }

  const applications = [
    {
      id: "app-1",
      jobId: "job-1",
      userId: "uid-2",
      timestamp: now,
    },
    {
      id: "app-2",
      jobId: "job-1",
      userId: "uid-2",
      timestamp: now,
    },
    {
      id: "app-3",
      jobId: "job-2",
      userId: "uid-1",
      timestamp: now,
    }
  ];
  for (const app of applications) {
    await db.collection("Applications").doc(app.id).set(app, { merge: true });
  }

  console.log("✅ Seeding complete. You may now run your backend tests.");
}

seed().catch(err => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});