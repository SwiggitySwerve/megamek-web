/**
 * Share Link Handler Page
 *
 * Handles incoming share links by validating and redeeming tokens.
 * Displays content preview and import options.
 *
 * @spec openspec/changes/add-vault-sharing/specs/vault-sharing/spec.md
 */

import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState, useCallback } from 'react';

import type { IShareLink } from '@/types/vault';

import { PageLayout, PageLoading, Card, Button } from '@/components/ui';
import { AppIcon, type AppIconName } from '@/components/ui/AppIcon';

// =============================================================================
// Types
// =============================================================================

interface RedeemResult {
  success: boolean;
  link?: IShareLink;
  error?: string;
  errorCode?: string;
}

interface ErrorPresentation {
  readonly title: string;
  readonly message: string;
  readonly icon: AppIconName;
}

const ERROR_PRESENTATIONS: Record<string, ErrorPresentation> = {
  NOT_FOUND: {
    title: 'Share Link Not Found',
    message: 'This share link does not exist or has been deleted.',
    icon: 'search',
  },
  EXPIRED: {
    title: 'Share Link Expired',
    message: 'This share link has expired and is no longer valid.',
    icon: 'clock',
  },
  MAX_USES: {
    title: 'Share Link Used Up',
    message: 'This share link has reached its maximum number of uses.',
    icon: 'info',
  },
  INACTIVE: {
    title: 'Share Link Inactive',
    message: 'This share link has been deactivated by its owner.',
    icon: 'lock',
  },
};

function errorPresentation(result: RedeemResult | null): ErrorPresentation {
  const knownError = result?.errorCode
    ? ERROR_PRESENTATIONS[result.errorCode]
    : undefined;
  return (
    knownError ?? {
      title: 'Invalid Share Link',
      message: result?.error || 'There was a problem with this share link.',
      icon: 'warning',
    }
  );
}

function ShareLinkErrorState({
  result,
  onTryAgain,
  onGoHome,
}: {
  readonly result: RedeemResult | null;
  readonly onTryAgain: () => void;
  readonly onGoHome: () => void;
}): React.JSX.Element {
  const presentation = errorPresentation(result);

  return (
    <PageLayout
      title={presentation.title}
      subtitle={presentation.message}
      backLink="/"
      backLabel="Go Home"
    >
      <Card variant="dark" className="mx-auto max-w-md p-8 text-center">
        <AppIcon
          name={presentation.icon}
          size="hero"
          className="mx-auto mb-4 text-red-400"
          aria-hidden="true"
        />
        <h2 className="text-text-theme-primary mb-2 text-xl font-bold">
          {presentation.title}
        </h2>
        <p className="text-text-theme-secondary mb-6">{presentation.message}</p>
        <div className="flex justify-center gap-3">
          <Button variant="secondary" onClick={onTryAgain}>
            Try Again
          </Button>
          <Button variant="primary" onClick={onGoHome}>
            Go Home
          </Button>
        </div>
      </Card>
    </PageLayout>
  );
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Format scope for display
 */
function formatScope(link: IShareLink): string {
  switch (link.scopeType) {
    case 'all':
      return 'All Vault Content';
    case 'category':
      return `All ${link.scopeCategory || 'Items'}`;
    case 'folder':
      return 'Shared Folder';
    case 'item':
      return 'Single Item';
    default:
      return link.scopeType;
  }
}

/**
 * Format permission level for display
 */
function formatLevel(level: string): string {
  switch (level) {
    case 'read':
      return 'View & Copy';
    case 'write':
      return 'View, Copy & Edit';
    case 'admin':
      return 'Full Access';
    default:
      return level;
  }
}

/**
 * Get level badge color
 */
function getLevelColor(level: string): string {
  switch (level) {
    case 'read':
      return 'bg-emerald-600';
    case 'write':
      return 'bg-amber-600';
    case 'admin':
      return 'bg-violet-600';
    default:
      return 'bg-surface-raised';
  }
}

// =============================================================================
// Component
// =============================================================================

export default function ShareLinkPage(): React.JSX.Element {
  const router = useRouter();
  const { token } = router.query;

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<RedeemResult | null>(null);

  // Redeem the share link on mount
  useEffect(() => {
    if (!token || typeof token !== 'string') {
      return;
    }

    const redeemLink = async () => {
      try {
        const response = await fetch('/api/vault/share/redeem', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = (await response.json()) as RedeemResult;
        setResult(data);
      } catch (err) {
        setResult({
          success: false,
          error:
            err instanceof Error ? err.message : 'Failed to redeem share link',
        });
      } finally {
        setLoading(false);
      }
    };

    redeemLink();
  }, [token]);

  const handleGoHome = useCallback(() => {
    router.push('/');
  }, [router]);

  const handleTryAgain = useCallback(() => {
    setLoading(true);
    setResult(null);
    router.reload();
  }, [router]);

  // Loading state
  if (loading || !token) {
    return (
      <>
        <PageLoading message="Validating share link..." />
      </>
    );
  }

  // Error states
  if (!result?.success) {
    return (
      <ShareLinkErrorState
        result={result}
        onTryAgain={handleTryAgain}
        onGoHome={handleGoHome}
      />
    );
  }

  // Success state - show link details
  const link = result.link!;

  return (
    <>
      <Head>
        <title>Share Link - MekStation</title>
      </Head>
      <PageLayout
        title="Share Link Accessed"
        subtitle="This share link grants you access to shared content"
        backLink="/"
        backLabel="Go Home"
      >
        <Card variant="dark" className="mx-auto max-w-md p-6">
          <div className="mb-6 text-center">
            <AppIcon
              name="check"
              size="feature"
              className="mx-auto mb-2 text-green-400"
              aria-hidden="true"
            />
            <h2 className="text-xl font-bold text-green-400">Access Granted</h2>
          </div>

          <div className="space-y-4">
            <div className="border-border-theme flex items-center justify-between border-b py-2">
              <span className="text-text-theme-secondary">Scope</span>
              <span className="text-text-theme-primary">
                {formatScope(link)}
              </span>
            </div>

            <div className="border-border-theme flex items-center justify-between border-b py-2">
              <span className="text-text-theme-secondary">Permission</span>
              <span
                className={`rounded px-2 py-1 text-xs font-medium text-white ${getLevelColor(link.level)}`}
              >
                {formatLevel(link.level)}
              </span>
            </div>

            {link.label && (
              <div className="border-border-theme flex items-center justify-between border-b py-2">
                <span className="text-text-theme-secondary">Label</span>
                <span className="text-text-theme-primary">{link.label}</span>
              </div>
            )}

            <div className="border-border-theme flex items-center justify-between border-b py-2">
              <span className="text-text-theme-secondary">Uses</span>
              <span className="text-text-theme-primary">
                {link.useCount}
                {link.maxUses ? ` / ${link.maxUses}` : ''}
              </span>
            </div>

            {link.expiresAt && (
              <div className="border-border-theme flex items-center justify-between border-b py-2">
                <span className="text-text-theme-secondary">Expires</span>
                <span className="text-text-theme-primary">
                  {new Date(link.expiresAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          <div className="bg-surface-deep mt-6 rounded-lg p-4">
            <p className="text-text-theme-secondary text-center text-sm">
              You now have{' '}
              <span className="text-text-theme-primary font-medium">
                {formatLevel(link.level)}
              </span>{' '}
              access to the shared content. The content should be available in
              your vault.
            </p>
          </div>

          <div className="mt-6">
            <Button variant="primary" className="w-full" onClick={handleGoHome}>
              Go to Vault
            </Button>
          </div>
        </Card>
      </PageLayout>
    </>
  );
}
