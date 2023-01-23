import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { userGroups } from "./userGroups";

const prisma =  new PrismaClient({
    // log: ['query', "info", "warn", "error"]
});

const createManyUsers = async (count: number) => {
    const fakeUsers = Array.from({ length: count }, () => ({
        name: faker.name.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        group: userGroups[Math.floor(Math.random() * userGroups.length)]
    }));

    console.time(`Create(many) ${count} users - PRISMA`);
    await prisma.user.createMany({
        data: fakeUsers,
    });
    console.timeEnd(`Create(many) ${count} users - PRISMA`);
}

const findUsers = async () => {
    console.time('Find users - PRISMA');
    await prisma.userAddresses.findMany();
    console.timeEnd('Find users - PRISMA');
}

const findByGroup = async (group: string) => {
    console.time('Find users by group - PRISMA');
    await prisma.user.findMany({
        where: {
            group: group,
        },
    });
    console.timeEnd('Find users by group - PRISMA');
}

const createUsersIntensive = async (count: number) => {
    const fakeUsers = Array.from({ length: count }, () => ({
        name: faker.name.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        group: userGroups[Math.floor(Math.random() * userGroups.length)],
        userAddresses: [
            {
                address: faker.address.streetAddress(),
                city: faker.address.city(),
                state: faker.address.state(),
                zip: faker.address.zipCode(),
                country: faker.address.country(),
            }
        ]
    }));

    console.time(`Create users intensive - PRISMA`)
    for (const user of fakeUsers) {
        await prisma.user.create({
            data: {
                ...user,
                userAddresses: {
                    create: user.userAddresses
                }
            },
        })
    }
    console.timeEnd(`Create users intensive - PRISMA`)
}

async function main() {
    await prisma.$connect();

    await createManyUsers(Number(process.argv[2]) || 1000);
    await createUsersIntensive(Number(process.argv[3]) || Number(process.argv[2]) || 1000);
    await findUsers();
    await findByGroup('guest');

    await prisma.$disconnect();
}

main().catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
