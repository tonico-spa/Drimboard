import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const projectToken = process.env.NEXT_PUBLIC_SANITY_PROJECT_TOKEN;
const dataset = process.env.NEXT_PUBLIC_SANITY_PROJECT_DATASET;
const apiVersion = '2023-05-03'; // use a recent date

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // `false` if you want to ensure fresh data
  token:projectToken
});

const builder = imageUrlBuilder(client);

// Then we export a simple function that takes the source image object
// and returns the builder, so we can chain methods to it
export function urlFor(source) {
  return builder.image(source);
}