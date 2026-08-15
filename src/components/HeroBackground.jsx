import heroBg from '../assets/hero-bg.jpg';

export default function HeroBackground() {
  return (
    <>
      <img
        alt="Indian farmer working in lush green agricultural field"
        className="fixed inset-0 w-full h-full object-cover"
        src={heroBg}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-black/10 via-black/45 to-black/85" />
      <div className="fixed inset-x-0 top-1/2 h-[56vh] -translate-y-1/2 bg-gradient-to-b from-transparent via-black/60 to-transparent" />
    </>
  );
}
