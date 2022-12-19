import { makeExecutableSchema } from "@graphql-tools/schema";
import { GraphQLError } from "graphql";
import type { GraphQLContext } from "./context";
import type { Link, Comment } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

const parseIntSafe = (value: string): number | null => {
  if (/^(\d+)$/.test(value)) {
    return parseInt(value, 10);
  }
  return null;
};

const validateLink = (value: string): string | null => {
  if (
    !!value &&
    /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/.test(
      value
    )
  ) {
    return value.trim();
  }
  return null;
};

const applyTakeConstraints = (params: {
  min: number;
  max: number;
  value: number;
}) => {
  if (
    params.value < 1 ||
    params.value < params.min ||
    params.value > params.max
  ) {
    throw new GraphQLError(
      `'take' argument value '${params.value}' is outside the valid range of '${params.min}' to '${params.max}'.`
    );
  }
  return params.value;
};

const typeDefinitions = /* GraphQL */ `
  type Link {
    id: ID!
    description: String!
    url: String!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    body: String!
    link: Link
  }

  type Query {
    info: String!
    feed(filterNeedle: String, skip: Int, take: Int): [Link!]!
    comment(id: ID!): Comment
    link(id: ID): Link
  }

  type Mutation {
    postLink(url: String!, description: String!): Link!
    postCommentOnLink(linkId: ID!, body: String!): Comment!
  }
`;

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    async feed(
      parent: unknown,
      args: { filterNeedle?: string; skip?: number; take?: number },
      context: GraphQLContext
    ) {
      const where = args.filterNeedle
        ? {
            OR: [
              { description: { contains: args.filterNeedle } },
              { url: { contains: args.filterNeedle } },
            ],
          }
        : {};

      const take = applyTakeConstraints({
        min: 1,
        max: 50,
        value: args.take ?? 30,
      });

      return context.prisma.link.findMany({
        where,
        skip: args.skip,
        take,
      });
    },
    async comment(
      parent: unknown,
      args: { id: string },
      context: GraphQLContext
    ) {
      return context.prisma.comment.findUnique({
        where: { id: parseInt(args.id) },
      });
    },
    async link(
      parent: unknown,
      { id }: { id: string },
      { prisma }: GraphQLContext
    ) {
      return prisma.link.findUnique({ where: { id: parseInt(id) } });
    },
  },
  Link: {
    comments(parent: Link, args: {}, context: GraphQLContext) {
      return context.prisma.comment.findMany({
        where: {
          linkId: parent.id,
        },
      });
    },
  },
  Comment: {
    link({ linkId }: Comment, {}, { prisma }: GraphQLContext) {
      return linkId
        ? prisma.link.findUnique({ where: { id: linkId } })
        : undefined;
    },
  },
  Mutation: {
    async postLink(
      parent: unknown,
      args: { description: string; url: string },
      context: GraphQLContext
    ) {
      const url = validateLink(args.url);
      if (url === null) {
        return Promise.reject(
          new GraphQLError(`Cannot create link with url '${args.url}'.`)
        );
      }
      const newLink = await context.prisma.link
        .create({
          data: {
            url,
            description: args.description,
          },
        })
        .catch((err: unknown) => {
          if (err instanceof PrismaClientKnownRequestError) {
            if (err.code === "P2003") {
              return Promise.reject(
                new GraphQLError(`Cannot create link with url '${args.url}'.`)
              );
            }
          }
          return Promise.reject(err);
        });
      return newLink;
    },
    async postCommentOnLink(
      parent: unknown,
      args: { linkId: string; body: string },
      context: GraphQLContext
    ) {
      const linkId = parseIntSafe(args.linkId);
      if (linkId === null) {
        return Promise.reject(
          new GraphQLError(
            `Cannot post comment on non-existing link with id '${args.linkId}'.`
          )
        );
      }

      const comment = await context.prisma.comment
        .create({
          data: {
            body: args.body,
            linkId,
          },
        })
        .catch((err: unknown) => {
          if (err instanceof PrismaClientKnownRequestError) {
            if (err.code === "P2003") {
              return Promise.reject(
                new GraphQLError(
                  `Cannot post comment on non-existing link with id '${args.linkId}'.`
                )
              );
            }
          }
          return Promise.reject(err);
        });
      return comment;
    },
  },
};

export const schema = makeExecutableSchema({
  resolvers: [resolvers],
  typeDefs: [typeDefinitions],
});
