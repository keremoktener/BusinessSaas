import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useTranslation } from "react-i18next";

export interface UpcomingBirthDatesProps {
  birthDates?: BirthDates[];
}

export interface BirthDates {
  firstName: string;
  lastName: string;
  birthDate: string;
}

export function UpcomingBirthDates({ birthDates = [] }: UpcomingBirthDatesProps): React.JSX.Element {
  const { t } = useTranslation();
  const [showAll, setShowAll] = React.useState(false); 

 
  const displayedBirthDates = showAll ? birthDates : birthDates.slice(0, 6); 

  return (
    <Card variant="outlined" sx={{ height: '100%', flexGrow: 1 }}>
      <CardHeader title={t('hrmService.upcomingbirthdates')} />
      <Divider />
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>{t('hrmService.firstName')}</TableCell>
              <TableCell>{t('hrmService.lastName')}</TableCell>
              <TableCell>{t('hrmService.birthDate')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedBirthDates.map((birthDate) => (
              <TableRow hover key={`${birthDate.firstName}-${birthDate.lastName}`}>
                <TableCell>{birthDate.firstName}</TableCell>
                <TableCell>{birthDate.lastName}</TableCell>
                <TableCell>{birthDate.birthDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          color="inherit"
          size="small"
          variant="text"
          onClick={() => setShowAll(!showAll)} 
        >
          {showAll ? t('dashboard.hide') : t('dashboard.viewall')} 
        </Button>
      </CardActions>
    </Card>
  );
}
