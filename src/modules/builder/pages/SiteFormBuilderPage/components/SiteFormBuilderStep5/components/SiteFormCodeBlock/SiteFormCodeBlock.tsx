import { determineApiHost } from '@/app';
import { CopyButton, envUtil } from '@/shared';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { CodeBlock } from '../CodeBlock/CodeBlock';

const Root = styled.div`
  position: relative;

  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Title = styled.p`
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
  color: var(--button-text-graphite-priory-text);
`;

const StyledCodeBlock = styled(CodeBlock)`
  max-height: 88px;
`;

const CopyButtonWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;

  width: 20px;
  height: 20px;
`;

interface Props {
  code: string;
  multiform: boolean;
}

const SiteFormCodeBlock = (props: Props) => {
  const { code, multiform } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix: 'builder.pages.site_form_builder_page.site_form_builder_step5',
  });

  const clientCode = useMemo<string>(
    () =>
      `<script id="workspace-form-builder-init-script" async>(function(w,d,c,l,b,cn,u,o){var p="workspace-form-builder";var t=Math.floor(Date.now()/3e5);var s=d.createElement("script");s.async=false;s.id=p+"-main-script";s.src=u+l+"?c="+c+"&t="+t+"&b="+encodeURIComponent(b)+"&cn="+cn+"&o="+encodeURIComponent(JSON.stringify(o));var cs=d.getElementById("workspace-form-builder-init-script");if(cs){cs.parentNode.insertBefore(s,cs.nextSibling)}else{d.body.appendChild(s)}var link=d.createElement("link");link.rel="stylesheet";link.href=u+"/workspace-form-builder-build/style.css?t="+t;link.id=p+"-style";d.head.appendChild(link)})(window,document,"${code}","/workspace-form-builder-build/workspace-form-builder.umd.js","${determineApiHost()}","${envUtil.appName}","${envUtil.appUrl}",{isSubmittable:true${multiform ? ',multiform:true' : ''}});</script>`,
    [code, multiform]
  );

  return (
    <Root>
      <Title>{t('copy_form_code')}:</Title>

      <StyledCodeBlock>{clientCode}</StyledCodeBlock>
      <CopyButtonWrapper>
        <CopyButton copyText={clientCode} />
      </CopyButtonWrapper>
    </Root>
  );
};

export { SiteFormCodeBlock };
