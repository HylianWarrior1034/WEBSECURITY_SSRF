const prisma = require("./client");
const faker = require("@faker-js/faker");
const fs = require("fs");

const generateFakeData = async () => {
  const ips = [];
  const urls = [];
  const allContents = fs.readFileSync("./websites.txt", "utf-8");

  for (let i = 0; i < 100; i++) {
    ips.push(faker.faker.internet.ipv4());
  }
  allContents.split(/\r?\n/).forEach((line) => {
    urls.push(line);
  });
  const createCall = [];
  await prisma.request.deleteMany({});
  for (let i = 0; i < 70000; i++) {
    createCall.push({
      sourceIp: ips[Math.floor(Math.random() * ips.length)],
      url: "www." + urls[Math.floor(Math.random() * urls.length)],
      body: {},
    });
  }
  await prisma.request.createMany({
    data: createCall,
  });
  console.log(urls);
};

try {
  generateFakeData();
} catch (err) {
  console.log(err);
  process.exit(1);
} finally {
  prisma.$disconnect();
}
