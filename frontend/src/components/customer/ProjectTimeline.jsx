import React from 'react';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';
import { Paper, Typography } from '@mui/material';
import { useSpring, animated } from '@react-spring/web';

const AnimatedPaper = animated(Paper);

const ProjectTimeline = ({ projects }) => {
  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' }
  });

  return (
    <AnimatedPaper style={fadeIn} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Project Timeline
      </Typography>
      <Timeline>
        {projects?.map((project, index) => (
          <TimelineItem key={project._id}>
            <TimelineSeparator>
              <TimelineDot color={getStatusColor(project.status)} />
              {index < projects.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent>
              <Typography variant="subtitle1">
                {project.vehicle.make} {project.vehicle.model}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Stage: {project.targetStage}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Status: {project.status}
              </Typography>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </AnimatedPaper>
  );
};

const getStatusColor = (status) => {
  const statusColors = {
    pending: 'warning',
    approved: 'info',
    in_progress: 'primary',
    completed: 'success',
    cancelled: 'error'
  };
  return statusColors[status] || 'default';
};

export default ProjectTimeline;
