import { GetStaticProps } from "next"
import Header from "../../components/Header"
import client from "../../sanity-client"
import { Post } from "../../type"
import imageUrlBuilder from "@sanity/image-url"
import PortableText from "react-portable-text"
import { useForm, SubmitHandler } from "react-hook-form"
import { useState } from "react"

interface IFormInput {
  _id: string
  name: string
  email: string
  comment: string
}
interface Props {
  post: Post
}

function Post({ post }: Props) {
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>()

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    await fetch("/api/createComment", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then(() => {
        setSubmitted(true)
        // console.log(data)
      })
      .catch((err) => {
        console.log(err)
        setSubmitted(false)
      })
  }

  return (
    <main>
      <Header />
      <img
        className="w-full object-cover h-40"
        src={urlFor(post.mainImage).url()!}
        alt="article poster"
      />

      <article className="max-w-3xl mx-auto p-5">
        <h1 className="text-3xl font-bold mt-10 mb-3">{post.title}</h1>
        <h2 className="text-md font-light text-gray-500 mb-2">
          {post.description}
        </h2>
        <div className="my-5 flex items-center mb-12 mt-5">
          <img
            className="w-12 h-12 rounded-full"
            src={urlFor(post.author.image).url()!}
            alt=""
          />
          <p className="font-extralight text-sm ml-5">
            blog post by {post.author.name} - Published at{" "}
            {new Date(post._createdAt).toLocaleDateString()}
          </p>
        </div>

        <div>
          <PortableText
            content={post.body}
            projectId="mfe3aewy"
            dataset="production"
            serializers={{
              normal: ({ children }: any) => {
                if (children.length === 1 && children[0] === "") {
                  return <br />
                }
                return <p>{children}</p>
              },
            }}
          />
        </div>

        <hr className="my-10 mx-auto border-yellow-500" />
        {!submitted ? (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col space-y-5 py-5 max-w-2xl mb-10"
          >
            <h3 className="font-bold text-2xl">Leave a comment below!</h3>
            <input
              {...register("_id", { required: true })}
              type="hidden"
              name="_id"
              value={post._id}
            />
            <label>
              <span className="text-gray-700">Name</span>
              <input
                {...register("name", { required: true })}
                className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 focus:ring-2 outline-none"
                placeholder="Name"
                type="text"
              />
            </label>
            <label>
              <span className="text-gray-700">Email</span>
              <input
                {...register("email", { required: true })}
                className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 focus:ring-2 outline-none"
                placeholder="Email"
                type="email"
              />
            </label>
            <label>
              <span className="text-gray-700">Comment</span>
              <textarea
                {...register("comment", { required: true })}
                className="shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-yellow-500 focus:ring-2 outline-none"
                placeholder="Your comment"
                rows={5}
              />
            </label>

            {Object.keys(errors).length !== 0 && (
              <div className="flex flex-col p-5 border-l-red-500 border border-y-0 border-r-0">
                {errors.name && (
                  <span className="text-red-500">
                    - The Name Field is required.
                  </span>
                )}
                {errors.email && (
                  <span className="text-red-500">
                    - The Email Field is required.
                  </span>
                )}
                {errors.comment && (
                  <span className="text-red-500">
                    - The Comment Field is required.
                  </span>
                )}
              </div>
            )}
            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded cursor-pointer"
            >
              Submit
            </button>
          </form>
        ) : (
          <div className="flex flex-col justify-center space-y-2 p-5 bg-yellow-500 text-white rounded-md">
            <h2 className="text-2xl font-bold">Thank you for your comment.</h2>
            <p>It will appear here once it has been approved.</p>
          </div>
        )}

        {post.comments.length !== 0 && (
          <div>
            <h3 className="text-2xl my-8">Comments</h3>
            {post.comments.map((comment) => {
              return (
                <p className="mb-8 border-l-yellow-500 border border-y-0 border-r-0 px-5">
                  <span className="text-yellow-500">{comment.comment}</span>
                  <br />
                  <span className="text-sm"> posted by {comment.name}</span>
                </p>
              )
            })}
          </div>
        )}
      </article>
    </main>
  )
}
export default Post

export const getStaticPaths = async () => {
  const query = `*[_type=='post']{
        _id,
          slug{
            current
          }
      }`
  const posts = await client.fetch(query)

  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }))

  return {
    paths,
    fallback: "blocking",
  }
}

const builder = imageUrlBuilder(client)
function urlFor(source: any) {
  return builder.image(source)
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == "post" && slug.current == $slug][0]{
        _id,
        _createdAt,
        title,
        author -> {
            name,
            image
        },
        'comments': *[
            _type == "comment" && 
            post._ref == ^._id &&
            Approved == true],
        description,
        mainImage,
        slug,
        body
    }`

  const post = await client.fetch(query, {
    slug: params?.slug,
  })

  if (!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: { post },
    revalidate: 60,
  }
}
