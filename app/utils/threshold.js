const prisma = require("../prisma/client");

// Byzantine Fault Tolerance
// F needs to be at most 1/3 of number of nodes
const runBFT = async (url) => {
  const unqiueIPs = await prisma.request.groupBy({
    by: ["sourceIp"],
    _count: {
      sourceIp: true,
    },
  });
  const f = unqiueIPs.length * 0.66;
  const requestsForURL = await prisma.request.findMany({
    where: {
      url,
    },
  });
  const numRequests = requestsForURL.length;
  if (numRequests > f) {
    return true;
  } else {
    return false;
  }
};

const checkReqBody = async (body, uri) => {
  // const previous =
  const keys = Object.keys(body);
  const vals = Object.values(body);

  const previous = await prisma.request.findMany({
    limit: 10,
    where: {
      url: uri,
    },
    orderBy: { createdAt: "desc" },
  });

  for (const l of previous) {
  }

  return true;
};

const shiftDate = (date) => {
  // logic to shift date by set amount of time to count as unique request
  date.setUTCHours(date.getUTCHours() - 1);
  return date;
};

const checkIfRequestIsOutsideOfTimeWindow = async (url, ip) => {
  // exponential??
  const date = new Date();
  const shiftedDate = shiftDate(date);
  const request = await prisma.request.findFirst({
    where: {
      sourceIp: ip,
      url: url,
      updatedAt: {
        gte: shiftedDate,
      },
    },
  });
  if (request === null || request === undefined) {
    return true;
  } else {
    await prisma.request.updateMany({
      where: {
        sourceIp: ip,
        url: url,
        updatedAt: {
          gte: shiftedDate,
        },
      },
      data: {
        updatedAt: new Date(),
      },
    });
    return false;
  }
};

const storeRequest = async (url, body, ip) => {
  const shouldStore = await checkIfRequestIsOutsideOfTimeWindow(url, ip);
  if (shouldStore) {
    await prisma.request.create({
      data: {
        sourceIp: ip,
        body,
        url,
      },
    });
    return true;
  } else {
    return false;
  }
};

module.exports = { storeRequest, runBFT };
