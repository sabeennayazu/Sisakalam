import ContentResultsDisplay from "@/components/shared/ContentResultsDisplay";

interface GenrePageProps {
  params: {
    genre: string;
  };
}

export default function GenreResultPage({ params }: GenrePageProps) {
  return <ContentResultsDisplay title={params.genre} label="Genre" />;
}
