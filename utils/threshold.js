import prisma from "../prisma/client";

// Byzantine Fault Tolerance
// F needs to be at most 1/3 of number of nodes
export const runBFT = async (url) => {
  const unqiueIPs = await prisma.request.groupBy({
    by: ["sourceIp"],
    _count: {
      sourceIp: true,
    },
  });
  const f = unqiueIPs.length * 0.3;
  const requestsForURL = await prisma.request.findMany({
    url,
  });
  const numRequests = requestsForURL.length;
  if (numRequests > f) {
    return true;
  } else {
    return false;
  }
};

const shiftDate = (date) => {
  // logic to shift date by set amount of time to count as unique request
  date.setUTCHours(date.getUTCHours() - 1);
  return date;
};

const checkIfRequestIsOutsideOfTimeWindow = async (url, ip) => {
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
    await prisma.request.update({
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

export const storeRequest = async (url, body, ip) => {
  if (checkIfRequestIsOutsideOfTimeWindow(url, ip)) {
    await prisma.request.createMany({
      sourceIp: ip,
      requestBody: body,
      url,
    });
    return true;
  } else {
    return false;
  }
};
