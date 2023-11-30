const prisma = require("../prisma/client");

const isAllowed = async (url) => {
  const allowed = await prisma.allowList.findFirst({
    where: {
      url,
    },
  });
  if (allowed !== null && allowed !== undefined) {
    return true;
  } else {
    return false;
  }
};

const isBlocked = async (url) => {
  const allowed = await prisma.blockList.findFirst({
    where: {
      url,
    },
  });
  if (allowed !== null && allowed !== undefined) {
    return false;
  } else {
    return true;
  }
};

// Byzantine Fault Tolerance
// F needs to be at most 2/3 of number of nodes
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
  const compare = (obj1, obj2) => {
    if (
      0.67 * Object.keys(obj2).length > Object.keys(obj1).length ||
      Object.keys(obj2).length * 1.33 < Object.keys(obj1).length
    ) {
      return false;
    }

    for (const key in Object.keys(obj1)) {
      if (key in obj2) {
        if (
          0.33 * String(obj2[key]).length > String(obj1[key]).length ||
          3 * String(obj2[key]).length < String(obj2[key]).length
        ) {
          return false;
        }
      }
    }
  };

  const previous = await prisma.request.findMany({
    limit: 10,
    where: {
      url: uri,
      NOT: {
        body: {},
      },
    },
    orderBy: { createdAt: "desc" },
  });

  var passed = 0;
  for (const l of previous) {
    if (compare(body, l.body)) {
      passed++;
    }
  }

  return passed / previous.length >= 0.7 ? true : false;
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
