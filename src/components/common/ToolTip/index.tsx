import React, { HTMLProps } from 'react';
import { connect } from 'react-redux';
import './styles.scss';
import { IRootState } from 'src/redux/rootReducer';
import { Tooltip, styled, TooltipProps, tooltipClasses } from '@mui/material';
import { BsInfoCircle } from 'react-icons/bs';

const InfoToolTip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    color: '#fff',
    backgroundColor: '#455A64',
    fontSize: 14,
    padding: '8px 12px',
    fontWeight: 400,
    borderRadius: 8,
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: '#455A64',
    bottom: '1px',
  },
}));

const renderToolTip = (message, placement, customIconContent, hasArrow) => {
  return (
    <InfoToolTip title={message} placement={placement} arrow={hasArrow}>
      {!!customIconContent ? (
        customIconContent
      ) : (
        <span>
          <BsInfoCircle
            style={{ color: '#888' }}
            size={16}
            className={'cmp-tool-tip__icon cmp-tool-tip__icon--info'}
          />
        </span>
      )}
    </InfoToolTip>
  );
};

const ToolTip: React.FC<Props> = ({
  message,
  placement = 'top',
  customIconContent,
  hasArrow = true,
  ...props
}) => {
  return <span {...props}>{renderToolTip(message, placement, customIconContent, hasArrow)}</span>;
};

type Props = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps &
  HTMLProps<HTMLSpanElement> & {
    message: string | React.ReactNode;
    customIconContent?: React.ReactNode;
    hasArrow?: boolean;
    placement?:
      | 'top-start'
      | 'top'
      | 'top-end'
      | 'left-start'
      | 'left'
      | 'left-end'
      | 'right-start'
      | 'right'
      | 'right-end'
      | 'bottom-start'
      | 'bottom'
      | 'bottom-end';
  };

const mapStateToProps = (state: IRootState) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ToolTip);
