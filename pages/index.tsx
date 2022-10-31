import { useQuery, gql } from "@apollo/client";

const GetAllPosts = gql`
  query GetAllPosts($first: Int) @live {
    postCollection(first: $first) {
      edges {
        cursor
        node {
          id
          title
          slug
          createdAt
          updatedAt
        }
      }
    }
  }
`;

const IndexPage = () => {
  const { data, loading, error } = useQuery(GetAllPosts, {
    variables: {
      first: 10,
    },
  });

  if (error) return <p>Something went wrong!</p>;
  if (loading) return <p>Loading data!</p>;

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
};

export default IndexPage;
