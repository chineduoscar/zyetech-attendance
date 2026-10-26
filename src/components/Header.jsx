const Header = ({ onLogin }) => {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-neutral-200 bg-white px-4 py-3 text-neutral-900 sm:px-6">
      <div className="flex min-w-0 items-center gap-1">
        {/* Put your logo in the public folder as logo.png (or change the path) */}
        <img
          src="/logo.png"
          alt="Zyetech logo"
          className="h-8 w-auto shrink-0 sm:h-11"
        />
        <span className="text-center text-xs font-bold leading-tight sm:text-base text-[#06066f]">
          Zyetech Innovation <br /> Technology
        </span>
      </div>

      {onLogin && (
        <button
          type="button"
          onClick={onLogin}
          className="shrink-0 rounded-full bg-[#06066f] px-5 py-2 font-semibold text-white transition-colors hover:bg-[#04044f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#06066f]"
        >
          Login
        </button>
      )}
    </header>
  );
};

export default Header;
