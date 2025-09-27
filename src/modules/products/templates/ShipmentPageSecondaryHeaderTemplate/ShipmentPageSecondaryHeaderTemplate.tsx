import { routes } from '@/app';
import {
  ArrowBackLink,
  HeaderDelimiter,
  LinkedEntityTag,
  PageSecondaryHeader,
  type EntityInfo,
} from '@/shared';
import type { ReactNode } from 'react';
import styled from 'styled-components';
import { WarehouseIcon } from '../../shared';

const Root = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  gap: 16px;
`;

const ShipmentNameWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ShipmentName = styled.h2`
  font-size: 14px;
  line-height: 20px;
  font-weight: 600;
  color: var(--graphite-graphite-840);
`;

const WarehouseNameWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const WarehouseName = styled.h3`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);
`;

const WarehouseIconWrapper = styled.div`
  width: 16px;
  height: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ControlsWrapper = styled.div`
  margin-left: auto;
`;

interface Props {
  backLink: string;
  shipmentName?: string;
  warehouseName?: string;
  entityInfo?: EntityInfo;
  Controls?: ReactNode;
}

const ShipmentPageSecondaryHeaderTemplate = (props: Props) => {
  const { backLink, shipmentName, warehouseName, entityInfo, Controls } = props;

  return (
    <PageSecondaryHeader>
      <Root>
        <ShipmentNameWrapper>
          <ArrowBackLink backLink={backLink} />

          <ShipmentName>{shipmentName}</ShipmentName>
        </ShipmentNameWrapper>

        {entityInfo && (
          <LinkedEntityTag
            $disabled={!entityInfo.hasAccess}
            to={routes.card({ entityTypeId: entityInfo.entityTypeId, entityId: entityInfo.id })}
          >
            {entityInfo.name}
          </LinkedEntityTag>
        )}

        {warehouseName && (
          <>
            <HeaderDelimiter />

            <WarehouseNameWrapper>
              <WarehouseIconWrapper>
                <WarehouseIcon />
              </WarehouseIconWrapper>

              <WarehouseName>{warehouseName}</WarehouseName>
            </WarehouseNameWrapper>
          </>
        )}

        {Controls && <ControlsWrapper>{Controls}</ControlsWrapper>}
      </Root>
    </PageSecondaryHeader>
  );
};

export { ShipmentPageSecondaryHeaderTemplate };
