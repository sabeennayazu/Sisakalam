import ContentResultsDisplay from "@/components/shared/ContentResultsDisplay";

interface TagPageProps {
  params: {
    tag: string;
  };
}

export default function TagResultPage({ params }: TagPageProps) {
  return <ContentResultsDisplay title={params.tag} label="Category Tag" />;
}
