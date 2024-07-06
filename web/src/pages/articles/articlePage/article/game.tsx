import { CloseButton, PageLayout } from "@components";

export function Game() {
  return (
    <PageLayout title="ИГРА" withCloseButton className="text" gap={4}>
      <div>Правила игры опубликуем в первый день фестиваля</div>
    </PageLayout>
  );
}
