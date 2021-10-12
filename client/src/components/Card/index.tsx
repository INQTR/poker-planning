import Button, { ButtonProps } from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { ReactElement, ReactNode } from 'react';

const CardButton = styled(Button)<ButtonProps>({
  minWidth: '52px',
  fontSize: 20,
  padding: '24px 12px',
  border: '2px solid',
  lineHeight: 1.5,
});

interface CardProps {
  children: ReactNode;
}

export function Card({ children }: CardProps): ReactElement {
  return <CardButton>{children}</CardButton>;
}
