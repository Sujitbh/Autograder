"""
File Preview Service for handling submission file previews.
"""

import os
from pathlib import Path
from typing import Optional, Dict, Any
import chardet


class FilePreviewService:
    """Service for previewing submission files."""

    # Maximum file size for preview (1MB)
    PREVIEW_SIZE_LIMIT = 1_000_000

    # Supported text file types with syntax highlighting language
    SUPPORTED_TEXT_TYPES = {
        '.py': 'python',
        '.js': 'javascript',
        '.jsx': 'javascript',
        '.ts': 'typescript',
        '.tsx': 'typescript',
        '.java': 'java',
        '.cpp': 'cpp',
        '.c': 'c',
        '.h': 'c',
        '.hpp': 'cpp',
        '.cs': 'csharp',
        '.rb': 'ruby',
        '.go': 'go',
        '.rs': 'rust',
        '.php': 'php',
        '.swift': 'swift',
        '.kt': 'kotlin',
        '.scala': 'scala',
        '.r': 'r',
        '.m': 'matlab',
        '.html': 'html',
        '.htm': 'html',
        '.xml': 'xml',
        '.css': 'css',
        '.scss': 'scss',
        '.sass': 'sass',
        '.less': 'less',
        '.sql': 'sql',
        '.sh': 'bash',
        '.bash': 'bash',
        '.zsh': 'bash',
        '.yml': 'yaml',
        '.yaml': 'yaml',
        '.json': 'json',
        '.md': 'markdown',
        '.txt': 'text',
        '.log': 'text',
        '.ini': 'ini',
        '.cfg': 'ini',
        '.conf': 'text',
        '.dockerfile': 'docker',
        '.gitignore': 'text',
        '.env': 'text',
    }

    SUPPORTED_IMAGE_TYPES = [
        '.png', '.jpg', '.jpeg', '.gif', '.svg', '.bmp', '.webp', '.ico'
    ]

    # Document types - planned for Phase 2
    # SUPPORTED_DOCUMENT_TYPES = [
    #     '.pdf', '.docx', '.doc', '.txt', '.rtf'
    # ]

    @staticmethod
    def can_preview(filename: str) -> bool:
        """
        Check if a file can be previewed based on its extension.
        Currently only supports text/code files.
        
        Args:
            filename: Name of the file
            
        Returns:
            True if file can be previewed, False otherwise
        """
        ext = Path(filename).suffix.lower()
        return ext in FilePreviewService.SUPPORTED_TEXT_TYPES
        # Phase 2 will add: or ext in FilePreviewService.SUPPORTED_IMAGE_TYPES

    @staticmethod
    def get_file_type(filename: str) -> Optional[str]:
        """
        Get the file type for syntax highlighting.
        
        Args:
            filename: Name of the file
            
        Returns:
            File type string (language identifier) or None
        """
        ext = Path(filename).suffix.lower()
        return FilePreviewService.SUPPORTED_TEXT_TYPES.get(ext)

    @staticmethod
    def is_text_file(filename: str) -> bool:
        """Check if file is a text file."""
        ext = Path(filename).suffix.lower()
        return ext in FilePreviewService.SUPPORTED_TEXT_TYPES

    @staticmethod
    def is_image_file(filename: str) -> bool:
        """Check if file is an image."""
        ext = Path(filename).suffix.lower()
        return ext in FilePreviewService.SUPPORTED_IMAGE_TYPES

    # Phase 2 - Document preview
    # @staticmethod
    # def is_document_file(filename: str) -> bool:
    #     """Check if file is a document."""
    #     ext = Path(filename).suffix.lower()
    #     return ext in FilePreviewService.SUPPORTED_DOCUMENT_TYPES

    @staticmethod
    def detect_encoding(file_path: str) -> str:
        """
        Detect file encoding.
        
        Args:
            file_path: Path to the file
            
        Returns:
            Detected encoding (defaults to 'utf-8')
        """
        try:
            with open(file_path, 'rb') as f:
                raw_data = f.read(10000)  # Read first 10KB
                result = chardet.detect(raw_data)
                encoding = result.get('encoding', 'utf-8')
                return encoding if encoding else 'utf-8'
        except Exception:
            return 'utf-8'

    @staticmethod
    def get_file_content(
        file_path: str,
        filename: str,
        max_size: Optional[int] = None
    ) -> Dict[str, Any]:
        """
        Read and return file content with metadata.
        
        Args:
            file_path: Path to the file
            filename: Original filename
            max_size: Maximum file size to read (optional)
            
        Returns:
            Dictionary containing file content and metadata
            
        Raises:
            ValueError: If file is too large or cannot be read
        """
        if not os.path.exists(file_path):
            raise ValueError("File not found")

        # Check file size
        file_size = os.path.getsize(file_path)
        size_limit = max_size or FilePreviewService.PREVIEW_SIZE_LIMIT
        
        if file_size > size_limit:
            raise ValueError(
                f"File too large for preview. Maximum size: {size_limit / 1024 / 1024:.1f}MB"
            )

        # Get file type
        file_type = FilePreviewService.get_file_type(filename)
        
        if not FilePreviewService.is_text_file(filename):
            raise ValueError("File type not supported for text preview")

        # Detect encoding
        encoding = FilePreviewService.detect_encoding(file_path)

        # Read file content
        try:
            with open(file_path, 'r', encoding=encoding, errors='replace') as f:
                content = f.read()
        except Exception as e:
            raise ValueError(f"Failed to read file: {str(e)}")

        # Count lines
        line_count = content.count('\n') + 1 if content else 0

        return {
            "filename": filename,
            "content": content,
            "file_type": file_type,
            "size_bytes": file_size,
            "encoding": encoding,
            "line_count": line_count,
            "can_preview": True,
        }

    @staticmethod
    def sanitize_content(content: str, max_length: Optional[int] = None) -> str:
        """
        Sanitize file content for safe display.
        
        Args:
            content: Raw file content
            max_length: Maximum length to return (optional)
            
        Returns:
            Sanitized content
        """
        if max_length and len(content) > max_length:
            content = content[:max_length] + "\n\n... (content truncated)"
        
        return content
