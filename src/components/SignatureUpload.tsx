import React, { FC, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Delete as DeleteIcon, CloudUpload as UploadIcon } from '@mui/icons-material';
import { API_BASE_URL } from '../config/api';
import { fetchWithAuth, getAuthToken } from '../utils/auth';

interface Signature {
  id: number;
  role: string;
  name: string;
  title: string | null;
  file_path: string;
  mime_type?: string;
  is_active: number;
  created_at: string;
  // Computed client-side URL for preview
  signature_url?: string;
}

const SignatureUpload: FC = () => {
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  // Fetch active signature for the Deputy Registrar role on mount
  React.useEffect(() => {
    fetchSignatures();
  }, []);

  const buildSignatureUrl = (filePath: string) => {
    if (!filePath) return '';
    try {
      const apiUrl = new URL(API_BASE_URL);
      // Drop /api/v1 from the path to get the web root for static files
      const basePath = apiUrl.pathname.replace(/\/api\/v1\/?$/, '');
      return `${apiUrl.origin}${basePath}${filePath}`;
    } catch {
      return filePath;
    }
  };

  const fetchSignatures = async () => {
    try {
      setLoading(true);
      // Always load the active signature for this fixed role
      const role = 'Deputy Registrar (Academic Affairs)';
      const res = await fetchWithAuth(`${API_BASE_URL}/signatures/${encodeURIComponent(role)}`, {
        method: 'GET',
      });
      if (res.ok) {
        const data = await res.json();
        const list: Signature[] = Array.isArray(data) ? data : (data ? [data] : []);
        const withUrls = list.map((sig) => ({
          ...sig,
          signature_url: buildSignatureUrl(sig.file_path),
        }));
        setSignatures(withUrls);
      } else {
        setSignatures([]);
      }
    } catch (e) {
      console.error('Failed to fetch signatures:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      setSignatureFile(file);
      setError('');
    }
  };

  const handleSubmit = async () => {
    if (!role || !name || !signatureFile) {
      setError('Please fill in all required fields and select a signature image');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const formData = new FormData();
      formData.append('role', role);
      formData.append('name', name);
      if (title) formData.append('title', title);
      formData.append('signature', signatureFile);

      // For FormData, we need to call fetch directly and add auth header manually
      const token = getAuthToken();
      const res = await fetch(`${API_BASE_URL}/signatures`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type - browser will set it with boundary for FormData
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Failed to upload signature');
      }

      setSuccess('Signature uploaded successfully!');
      setRole('');
      setName('');
      setTitle('');
      setSignatureFile(null);
      // Reset file input
      const fileInput = document.getElementById('signature-file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      // Refresh signatures list
      await fetchSignatures();
    } catch (e: any) {
      setError(e.message || 'Failed to upload signature');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (url: string) => {
    setPreviewUrl(url);
    setPreviewOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ color: '#333', mb: 3 }}>
        Signature Management
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Upload New Signature
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
                {success}
              </Alert>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Role *"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Deputy Registrar (Academic Affairs)"
                required
              />

              <TextField
                fullWidth
                label="Name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dr. Jane Smith"
                required
              />

              <TextField
                fullWidth
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Deputy Registrar (Academic Affairs)"
              />

              <Box>
                <input
                  id="signature-file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<UploadIcon />}
                  onClick={() => document.getElementById('signature-file-input')?.click()}
                  fullWidth
                  sx={{
                    borderStyle: 'dashed',
                    borderColor: signatureFile ? '#13A215' : '#ccc',
                    color: signatureFile ? '#13A215' : 'text.secondary',
                  }}
                >
                  {signatureFile ? signatureFile.name : 'Select Signature Image'}
                </Button>
                {signatureFile && (
                  <Box sx={{ mt: 1, textAlign: 'center' }}>
                    <img
                      src={URL.createObjectURL(signatureFile)}
                      alt="Preview"
                      style={{ maxWidth: '100%', maxHeight: 150, border: '1px solid #ddd', borderRadius: 4 }}
                    />
                  </Box>
                )}
              </Box>

              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading || !role || !name || !signatureFile}
                sx={{ bgcolor: '#13A215', '&:hover': { bgcolor: '#0f7d10' } }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Upload Signature'}
              </Button>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Existing Signatures
            </Typography>

            {loading && signatures.length === 0 ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : signatures.length === 0 ? (
              <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', p: 3 }}>
                No signatures uploaded yet
              </Typography>
            ) : (
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Created</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>Preview</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {signatures.map((sig) => (
                      <TableRow key={sig.id}>
                        <TableCell>{sig.role}</TableCell>
                        <TableCell>{sig.name}</TableCell>
                        <TableCell>
                          <Chip
                            label={sig.is_active ? 'Active' : 'Inactive'}
                            color={sig.is_active ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{formatDate(sig.created_at)}</TableCell>
                        <TableCell align="center">
                          <Tooltip title="Preview">
                            <IconButton
                              size="small"
                              onClick={() => handlePreview(sig.signature_url || '')}
                              sx={{ color: '#13A215' }}
                            >
                              <UploadIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Card>
        </Grid>
      </Grid>

      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Signature Preview</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', p: 2 }}>
            <img
              src={previewUrl}
              alt="Signature"
              style={{ maxWidth: '100%', maxHeight: 300, border: '1px solid #ddd', borderRadius: 4 }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+PC9zdmc+';
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SignatureUpload;
