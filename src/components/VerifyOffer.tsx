import { FC, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Card,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { CheckCircle, Cancel, QrCode2 } from '@mui/icons-material';
import { API_BASE_URL } from '../config/api';
import wuaLogo from './wua-logo.png';

type VerifyStatus = 'idle' | 'loading' | 'success' | 'error';

const VerifyOffer: FC = () => {
  const [searchParams] = useSearchParams();
  const code = useMemo(() => searchParams.get('code')?.trim() || '', [searchParams]);
  const [status, setStatus] = useState<VerifyStatus>('idle');
  const [message, setMessage] = useState<string>('');
  const [details, setDetails] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    if (!code) {
      setStatus('error');
      setMessage('Missing verification code. Please scan a valid QR code.');
      return;
    }

    let isMounted = true;
    const verify = async () => {
      setStatus('loading');
      setMessage('Verifying offer letter...');

      try {
        const response = await fetch(
          `${API_BASE_URL}/student-numbers/offer-letter/verify?code=${encodeURIComponent(code)}`
        );
        const data = await response.json().catch(() => ({}));

        if (!isMounted) return;

        if (!response.ok) {
          const errorMessage =
            (data && (data.message || data.error)) || 'Verification failed. Please try again.';
          setStatus('error');
          setMessage(String(errorMessage));
          setDetails(data && typeof data === 'object' ? data : null);
          return;
        }

        const successMessage =
          (data && (data.message || data.status)) || 'Offer letter verified successfully.';
        setStatus('success');
        setMessage(String(successMessage));
        setDetails(data && typeof data === 'object' ? data : null);
      } catch (error) {
        if (!isMounted) return;
        setStatus('error');
        setMessage('Network error. Please check your connection and try again.');
        setDetails(null);
      }
    };

    verify();
    return () => {
      isMounted = false;
    };
  }, [code]);

  const highlightItems = useMemo(() => {
    if (!details) return [];
    const pick = (key: string) => details[key] as string | number | undefined;
    const items = [
      { label: 'Reference', value: pick('referenceNumber') || pick('reference_number') },
      { label: 'Student Number', value: pick('studentNumber') || pick('student_number') },
      { label: 'Programme', value: pick('acceptedProgramme') || pick('accepted_programme') },
      { label: 'Applicant', value: pick('applicantName') || pick('applicant_name') },
    ].filter((item) => item.value);
    return items as Array<{ label: string; value: string | number }>;
  }, [details]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#F7F8F4',
        display: 'flex',
        alignItems: 'center',
        py: 6,
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
            boxShadow: '0 18px 50px rgba(18, 52, 27, 0.15)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              borderTop: '6px solid #EEB422',
              pointerEvents: 'none',
            }}
          />
          <Stack spacing={3}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                component="img"
                src={wuaLogo}
                alt="WUA"
                sx={{ width: 52, height: 52 }}
              />
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Offer Letter Verification
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Women&apos;s University of Africa
                </Typography>
              </Box>
            </Stack>

            <Divider />

            <Stack spacing={2} alignItems="center" textAlign="center">
              {status === 'loading' && (
                <>
                  <CircularProgress size={42} sx={{ color: '#13A215' }} />
                  <Typography variant="body1">{message}</Typography>
                </>
              )}

              {status === 'success' && (
                <>
                  <CheckCircle sx={{ fontSize: 56, color: '#13A215' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Verified
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    {message}
                  </Typography>
                </>
              )}

              {status === 'error' && (
                <>
                  <Cancel sx={{ fontSize: 56, color: '#d32f2f' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Not Verified
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    {message}
                  </Typography>
                </>
              )}

              {status === 'idle' && (
                <>
                  <QrCode2 sx={{ fontSize: 56, color: '#546e7a' }} />
                  <Typography variant="body1">
                    Awaiting verification code...
                  </Typography>
                </>
              )}
            </Stack>

            {highlightItems.length > 0 && (
              <Stack spacing={2}>
                <Divider />
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  Verification Details
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {highlightItems.map((item) => (
                    <Chip
                      key={item.label}
                      label={`${item.label}: ${item.value}`}
                      variant="outlined"
                      sx={{ borderColor: '#13A215', color: '#0f7d10' }}
                    />
                  ))}
                </Stack>
              </Stack>
            )}

            <Divider />

            <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'center' }}>
              Code: {code || 'N/A'}
            </Typography>
          </Stack>
        </Card>
      </Container>
    </Box>
  );
};

export default VerifyOffer;
