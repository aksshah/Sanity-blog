import imageUrlBuilder from "@sanity/image-url"
import Head from "next/head"
import Link from "next/link"
import Header from "../components/Header"
import Stage from "../components/Stage"
import client from "../sanity-client"
import { Post } from "../type"

interface Props {
  posts: [Post]
}

export default function Home(props: Props) {
  return (
    <>
      <Head>
        <title>Medium - with Sanity</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Header />
        <Stage />
        {props.posts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-6 mx-auto max-w-7xl">
            {props.posts.map((post: Post) => {
              return (
                <Link key={post._id} href={`/post/${post.slug.current}`}>
                  {post.mainImage && (
                    <div className="border rounded-lg group cursor-pointer overflow-hidden">
                      <img
                        className="h-60 w-full object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out"
                        src={urlFor(post.mainImage).url()}
                        alt={`cover image - ${post.slug.current}`}
                      />
                      <div className="flex justify-between p-5 bg bg-white items-center">
                        <div>
                          <p className="font-bold">{post.title}</p>
                          <p className="text-xs">{post.author.name}</p>
                        </div>
                        <img
                          className="h-14 w-14 rounded-full"
                          src={urlFor(post.author.image).url()}
                          alt={`Author Portrait - ${post.author.name}`}
                        />
                      </div>
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        )}
      </body>
    </>
  )
}

const builder = imageUrlBuilder(client)
function urlFor(source: any) {
  return builder.image(source)
}

export const getServerSideProps = async () => {
  const posts = await client.fetch(`
    *[_type == 'post'] {
      _id,
      _createdAt,
      title,
      author -> {
        name,
        image
      },
      description,
      mainImage,
      slug,
    }
  `)
  return {
    props: {
      posts,
    },
  }
}
