import React from 'react'
import { getAllPosts, getSinglePost } from "../../libs/notionAPI";
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

export const getStaticPaths = async () => {
  const allPosts = await getAllPosts();
  const paths = allPosts.map(({ slug }) => ({ params: { slug } }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps = async ({ params }:any) => {
  const post = await getSinglePost(params.slug);

  return {
    props: {
      post,
    },
    revalidate: 10,
  };
};

const Post = ({post}:any) => {

  return (

    <section className="container h-auto lg:px-2 px-5 lg:w-3/5 mx-auto mt-20">
    <h2 className="w-full text-3xl font-medium">{post.metadata.title}</h2>
    <div className="border-b-2 w-1/3 mt-1 border-sky-900"></div>
    <span className="text-gray-500">Posted date at {post.metadata.date}</span>
    <br />
    {post.metadata.tags.map((tag: string, index: number) => (
      <p
        className="text-white bg-sky-900 rounded-xl font-medium mt-2 px-2 inline-block mr-2"
        key={index}
      >
        <Link href={`/posts/tag/${tag}/page/1`}>{tag}</Link>
      </p>
    ))}
    <div className="mt-10 font-medium markdown">
    <ReactMarkdown
          components={{
            code({ node, inline, className, children }) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code>{children}</code>
              );
            },
          }}
        >
          {post.markdown}
          
        </ReactMarkdown>
        <br /><br />

      <Link href="/">
        <div className="pb-20 mt-10 text-sky-900 float-right">←ホームに戻る</div>
      </Link>
    </div>
  </section>

  )
}

export default Post;