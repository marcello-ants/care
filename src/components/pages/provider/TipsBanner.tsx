import { useState } from 'react';
import { Icon24InfoTips } from '@care/react-icons';
import { Button, makeStyles, Typography } from '@material-ui/core';
import { Modal } from '@care/react-component-lib';

const useStyles = makeStyles((theme) => ({
  tipsButton: {
    display: 'flex',
    cursor: 'pointer',
    gap: '6px',
    alignItems: 'center',
    background: 'transparent',
    border: 0,
    fontSize: theme.spacing(2),
    color: theme.palette.care?.blue[700],
  },
  tips: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    textAlign: 'left',
  },
  subheader: {
    margin: theme.spacing(2, 0),
  },
  list: {
    paddingLeft: theme.spacing(2),
    margin: 0,
  },
}));

const TipsBanner = () => {
  const classes = useStyles();
  const [showBanner, setShowBanner] = useState(false);

  return (
    <>
      <button type="button" className={classes.tipsButton} onClick={() => setShowBanner(true)}>
        <Icon24InfoTips />
        <span>Tips</span>
      </button>
      <Modal
        open={showBanner}
        onClose={() => setShowBanner(false)}
        title="Tips to create a bio and get the right job"
        ButtonPrimary={
          <Button variant="contained" color="secondary" onClick={() => setShowBanner(false)}>
            Got it
          </Button>
        }>
        <div className={classes.tips}>
          <ul className={classes.list}>
            <li> Create a must-read bio with lots of details so families get your vibe</li>
            <li> Set expectations by telling families what type of job you&apos;re looking for</li>
            <li> Tell families how you&apos;ve come to love what you do</li>
          </ul>
          <Typography variant="h3" component="p">
            Examples:
          </Typography>
          <Typography variant="h3" component="p">
            Alice B from Oakland, CA
          </Typography>
          <Typography variant="body2">
            I&apos;m a positive and energetic mother of three and grandmother to three
            grandchildren. For several years, I worked on and off in daycare centers mostly because
            I love working with kids. Recently, I&apos;ve been busy helping raise my grandbabies!
            Now that the grandkids are in school, I&apos;m looking for a way to earn a little extra
            money while doing the thing I love. I&apos;m confident, energetic, and fun. I do think
            kids are kids, but it&apos;s up to adults to teach them to respect others, nature, and
            the world around them. My passion is watching and teaching kiddos about this fantastic
            world around us.
          </Typography>
          <Typography variant="h3" component="p">
            Gina S from Somerville, MA
          </Typography>
          <Typography variant="body2">
            Hi! I am a very reliable, patient, and creative person who has approximately 15 years of
            experience caring for children, from infants to teenagers. With me, your children will
            receive appropriate care, and I&apos;m willing to do additional other tasks if
            requested. Personally, I&apos;m an organizer, planner, and multitasker, so minimum
            supervision is required. With all my skills and experience, I&apos;m able to provide a
            supervised, safe, and stable environment for your little ones.
          </Typography>
        </div>
      </Modal>
    </>
  );
};
export default TipsBanner;
