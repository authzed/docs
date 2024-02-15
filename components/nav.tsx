import { FunctionComponent, ReactNode } from 'react';
import data from '../content/settings/navigation.yaml';
export type NavItem = {
  label: string;
  url: string;
  isDivider?: boolean;
  columnBreak?: boolean;
};

export type NavGroup = {
  label: string;
  url?: string;
  isGroup?: boolean;
  columnCount?: number;
  items: NavItem[];
};

export type NavEntry = NavGroup;

const navData = {
  navigation: loadNavData('navigation'),
  footer: loadNavData('footer'),
};

function loadNavData(source: string): NavEntry[] {
  return data[source];
}

type NavDataSource = 'navigation' | 'footer';

export function generateNav(
  itemGenerator: (item: NavItem, entryIndex: number) => ReactNode,
  groupGenerator: (
    group: NavGroup,
    children: ReactNode,
    entryIndex: number
  ) => ReactNode,
  dividerGenerator: (
    divider: NavItem,
    entryIndex: number,
    groupIndex: number
  ) => ReactNode,
  groupItemGenerator: (
    item: NavItem,
    entryIndex: number,
    groupIndex: number
  ) => ReactNode,
  source: NavDataSource = 'navigation'
): FunctionComponent {
  return function GenNav() {
    return (
      <>
        {navData[source].map((entry, index) => {
          if (entry.isGroup) {
            const children = entry.items?.map((item, groupIndex) => {
              if (item.isDivider) {
                return dividerGenerator(item, index, groupIndex);
              }
              return groupItemGenerator(item, index, groupIndex);
            });
            return groupGenerator(entry, children, index);
          }

          return itemGenerator(entry as NavItem, index);
        })}
      </>
    );
  };
}
