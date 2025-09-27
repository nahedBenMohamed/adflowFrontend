import { SidebarDelimiter } from '../Sidebar/components';
import { SidebarSectionSkeleton } from './SidebarSectionSkeleton';

interface Props {
  opened: boolean;
}

const SidebarSkeleton = (props: Props) => {
  const { opened } = props;

  const FourSections = new Array(4)
    .fill(0)
    .map((_, idx) => <SidebarSectionSkeleton key={idx} opened={opened} />);

  return (
    <>
      {FourSections}

      <SidebarDelimiter />

      {FourSections}
    </>
  );
};

export { SidebarSkeleton };
