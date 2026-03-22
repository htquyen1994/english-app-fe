//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {},
  // Nx monorepo: transpile local packages trực tiếp từ source (TypeScript + CSS Modules)
  // Không cần build packages/ui trước khi dùng trong app
  transpilePackages: ['@english-app/ui'],
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
