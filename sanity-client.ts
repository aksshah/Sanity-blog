import { createClient } from "next-sanity"

const client = createClient({
  projectId: "mfe3aewy",
  dataset: "production",
  apiVersion: "2023-01-10",
  useCdn: false,
  token: process.env.SANITY_API,
})

export default client
