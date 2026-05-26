import { Button, Tag, Tags } from "@components";
import { PageLayout } from "@components/PageLayout";
import { useCell } from "@helpers/cell-state";
import { authStore } from "@stores/auth.store";
import { useRouter } from "../routing";
import { useEffect } from "preact/hooks";
import { AddUserForm } from "./add-user";

export function AdminPage() {
    return (
      <PageLayout
        title={"админка"}
      >
        <AdminContent/>
      </PageLayout>
    );
}

function AdminContent() {
  const isAdmin = useCell(() => authStore.isAdmin);
  const router = useRouter();
  const section = router.route[1] as keyof typeof sections | undefined;
  const goTo = (section, replace = true) => {
    router.goTo(["admin", section], {}, replace);
  };
  useEffect(() => {
    if (!section) {
      goTo(Object.keys(sections)[0]);
    }
  }, [!!section]);
  if (!isAdmin)
    return <>Без админского токеню не пущу!</>
  return <>
    {Object.keys(sections).length > 1 && <Tags tagsList={Object.keys(sections)} style={{ marginTop: 28, marginBottom: 8 }}>
      {(x) => (
        <Tag
          key={x}
          value={x}
          onClick={() => goTo(x)}
          selected={x === section}
        >
          {sections[x]?.title}
        </Tag>
      )}
    </Tags>}
    {sections[section]?.render()}
  </>
}


const sections = {
  user: {
    title: 'Юзвери',
    render() {
      return <>
        <AddUserForm/>
      </>
    }
  }
}
