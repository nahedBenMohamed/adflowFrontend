import { boardApiUtil, entityTypeStore, iconStore } from '@/app';
import { MySelect, SpanWithEllipsis, TruncateMixin } from '@/shared';
import { observer } from 'mobx-react-lite';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { SiteFormEntityTypeLinkModel } from '../../../../../../shared';

const Root = styled.li`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  padding: 12px 16px;
  border-radius: var(--border-radius-element);
  box-shadow:
    0px 0px 2px 0px #eef4fe,
    0px 1px 2px 0px #d0daeb;

  ${TruncateMixin}
`;

const LeftBlock = styled.label`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16px;

  ${TruncateMixin}
`;

const RightBlock = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 16px;
`;

const NameWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  ${TruncateMixin}
`;

const IconWrapper = styled.div<{ $iconColor: string }>`
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 100%;
    height: auto;
  }

  svg rect,
  svg circle,
  svg ellipse,
  svg path {
    fill: ${p => p.$iconColor};
  }
`;

const BoardAnnotation = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  white-space: nowrap;
  color: var(--button-text-graphite-primary-text);
`;

interface Props {
  entityTypeLink: SiteFormEntityTypeLinkModel;
  Control: ReactNode;
}

const SiteFormBuilderLinkedEntityItemTemplate = observer((props: Props) => {
  const {
    entityTypeLink: { entityTypeId, boardId },
    Control,
  } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix: 'builder.pages.site_form_builder_page.site_form_builder_step1',
  });

  const et = entityTypeStore.getById(entityTypeId);

  const { icon } = iconStore.getByName(et.section.icon);
  const iconColor = iconStore.getEntityColorByEntityCategory(et.entityCategory);

  const boardOptions = boardApiUtil.useGetBoardsByEntityTypeIdOptions(entityTypeId);

  return (
    <Root>
      <LeftBlock>
        {Control}

        <NameWrapper>
          <IconWrapper $iconColor={iconColor}>{icon}</IconWrapper>

          <SpanWithEllipsis text={et.name} />
        </NameWrapper>
      </LeftBlock>

      {boardOptions.length > 0 && (
        <RightBlock>
          <BoardAnnotation>{t('choose_board_annotation')}</BoardAnnotation>

          <MySelect
            withinPortal
            model={boardId}
            placeholder={t('placeholders.board')}
            variant="outlined-without-active-shadow"
            options={boardOptions}
          />
        </RightBlock>
      )}
    </Root>
  );
});

export { SiteFormBuilderLinkedEntityItemTemplate };
