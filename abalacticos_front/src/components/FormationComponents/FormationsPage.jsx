import React, { useState } from 'react';
import CreateFormationForm from './CreateFormationForm';
import FormationsList from './FormationsList';
import { Typography, Container, Button, ButtonGroup } from '@mui/material';

const FormationsPage = () => {
    const [currentView, setCurrentView] = useState('create'); // 'create' or 'list'

    return (
        <Container>
            <Typography variant="h4" gutterBottom style={{ marginTop: '2rem' }}>
                Formations
            </Typography>
            <ButtonGroup variant="contained" color="primary" style={{ marginBottom: '1rem' }}>
                <Button
                    onClick={() => setCurrentView('create')}
                    variant={currentView === 'create' ? 'contained' : 'outlined'}
                >
                    Create Formation
                </Button>
                <Button
                    onClick={() => setCurrentView('list')}
                    variant={currentView === 'list' ? 'contained' : 'outlined'}
                >
                    All Formations
                </Button>
            </ButtonGroup>
            {currentView === 'create' && <CreateFormationForm />}
            {currentView === 'list' && <FormationsList />}
        </Container>
    );
};

export default FormationsPage;


