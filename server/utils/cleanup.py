import os
import shutil
import time
from pathlib import Path
from typing import Optional
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def is_file_in_use(file_path: Path) -> bool:
    """Check if a file is currently in use"""
    try:
        with open(file_path, 'rb') as f:
            return False
    except (IOError, PermissionError):
        return True

def cleanup_old_files(directory: str, max_age_minutes: int = 60) -> None:
    """
    Remove files and folders older than max_age_minutes from the specified directory.
    
    Args:
        directory (str): Path to the directory to clean
        max_age_minutes (int): Maximum age of files in minutes before they are deleted
    """
    try:
        directory_path = Path(directory)
        if not directory_path.exists():
            return

        current_time = time.time()
        max_age_seconds = max_age_minutes * 60

        # Process all items in the directory
        for item in directory_path.iterdir():
            try:
                # Skip the directory itself, hidden files, and current files
                if item.name.startswith('.'):
                    continue

                # Get the modification time of the directory or its contents
                if item.is_dir():
                    try:
                        # Check if any files in the directory are in use
                        files_in_use = any(is_file_in_use(f) for f in item.rglob('*') if f.is_file())
                        if files_in_use:
                            continue

                        # For directories, check the newest file within
                        newest_time = max(
                            (f.stat().st_mtime for f in item.rglob('*') if f.is_file()),
                            default=item.stat().st_mtime
                        )
                        item_age = current_time - newest_time
                    except Exception:
                        # If we can't check contents, skip this directory
                        continue
                else:
                    # Skip files that are in use
                    if is_file_in_use(item):
                        continue
                    item_age = current_time - item.stat().st_mtime

                # Delete if older than max age
                if item_age > max_age_seconds:
                    try:
                        if item.is_dir():
                            shutil.rmtree(item)
                            logger.info(f"Deleted old directory: {item}")
                        else:
                            item.unlink()
                            logger.info(f"Deleted old file: {item}")
                    except Exception:
                        # Suppress deletion errors as they're usually due to timing issues
                        pass

            except Exception:
                # Suppress processing errors for individual items
                continue

    except Exception as e:
        logger.error(f"Error during cleanup: {str(e)}")

def cleanup_podcast_files(podcast_id: str, output_dir: str) -> None:
    """
    Remove all files and folders related to a specific podcast.
    
    Args:
        podcast_id (str): ID of the podcast to clean up
        output_dir (str): Base directory for podcast output
    """
    try:
        # Add a small delay to ensure the file is served
        time.sleep(2)

        podcast_path = Path(output_dir) / podcast_id
        
        # If podcast_id is a file path, get its directory
        if podcast_path.is_file():
            podcast_dir = podcast_path.parent
        else:
            podcast_dir = podcast_path

        # Only proceed if the directory exists and no files are in use
        if podcast_dir.exists() and podcast_dir.is_dir():
            # Check if any files are in use
            files_in_use = any(is_file_in_use(f) for f in podcast_dir.rglob('*') if f.is_file())
            if files_in_use:
                logger.info(f"Skipping cleanup of {podcast_dir} as files are in use")
                return

            # Add extra check to ensure we're not deleting the root output directory
            if podcast_dir.name != Path(output_dir).name:
                shutil.rmtree(podcast_dir)
                logger.info(f"Deleted podcast directory: {podcast_dir}")
            else:
                logger.warning(f"Attempted to delete root output directory, skipping: {podcast_dir}")
        else:
            logger.debug(f"Podcast directory not found: {podcast_dir}")

    except Exception as e:
        logger.error(f"Error cleaning up podcast files: {str(e)}")
