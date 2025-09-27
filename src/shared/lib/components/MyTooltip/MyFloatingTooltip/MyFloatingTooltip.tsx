import { Tooltip, type TooltipFloatingProps } from '@mantine/core';

const MyFloatingTooltip = (props: TooltipFloatingProps) => {
  const { children, ...rest } = props;

  return (
    <Tooltip.Floating
      {...rest}
      styles={{
        tooltip: {
          fontWeight: 400,
          padding: '2px 8px',
          backgroundColor: 'var(--button-text-graphite-primary-text)',
        },
      }}
    >
      {children}
    </Tooltip.Floating>
  );
};

export { MyFloatingTooltip };
