import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const sendProjectUpdateEmail = async (user, project) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: `Tuning Project Update - ${project.vehicle.make} ${project.vehicle.model}`,
    html: `
      <h2>Project Status Update</h2>
      <p>Your tuning project has been updated to: ${project.status}</p>
      <p>Vehicle: ${project.vehicle.year} ${project.vehicle.make} ${project.vehicle.model}</p>
      <p>Target Stage: ${project.targetStage}</p>
      <p>Notes: ${project.notes || 'No additional notes'}</p>
    `
  };

  return transporter.sendMail(mailOptions);
};