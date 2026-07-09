This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 자유게시판 관리자 설정 (Admin Settings for Free Board)

자유게시판의 스팸이나 광고글 등을 관리자가 강제 삭제할 수 있도록 마스터 비밀번호 기능이 내장되어 있습니다.

- **설정 방법**:
  배포 플랫폼(Vercel 등)이나 로컬 환경의 환경 변수(Environment Variables) 설정에 `ADMIN_PASSWORD`를 추가하고 원하시는 관리자 비밀번호를 지정해 주세요.
  안전을 위해 기본값은 소스 코드에 저장되어 있지 않으며, 환경 변수가 정의되었을 때만 마스터 비밀번호가 활성화됩니다.
