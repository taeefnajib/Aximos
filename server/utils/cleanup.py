import os
import shutil
import time
from pathlib import Path
from typing import Optional
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def cleanup_old_files(directory: str, max_age_minutes: int = 30) -> None:
    """
    Remove files and folders older than max_age_minutes from the specified directory.
    
    Args:
        directory (str): Path to the directory to clean
        max_age_minutes (int): Maximum age of files in minutes before they are deleted
    """
    try:
        directory_path = Path(directory)
        if not directory_path.exists():
            logger.warning(f"Directory {directory} does not exist")
            return

        current_time = time.time()
        max_age_seconds = max_age_minutes * 60

        # Process all items in the directory
        for item in directory_path.iterdir():
            try:
                # Skip the directory itself and any hidden files
                if item.name.startswith('.'):
                    continue

                item_age = current_time - item.stat().st_mtime
                if item_age > max_age_seconds:
                    if item.is_dir():
                        shutil.rmtree(item)
                        logger.info(f"Deleted old directory: {item}")
                    elif item.is_file():
                        item.unlink()
                        logger.info(f"Deleted old file: {item}")

            except Exception as e:
                # Log the error but continue processing other items
                logger.error(f"Error processing {item}: {str(e)}")
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

        # Only proceed if the directory exists
        if podcast_dir.exists() and podcast_dir.is_dir():
            # Add extra check to ensure we're not deleting the root output directory
            if podcast_dir.name != Path(output_dir).name:
                shutil.rmtree(podcast_dir)
                logger.info(f"Deleted podcast directory: {podcast_dir}")
            else:
                logger.warning(f"Attempted to delete root output directory, skipping: {podcast_dir}")
        else:
            logger.warning(f"Podcast directory not found: {podcast_dir}")

    except Exception as e:
        logger.error(f"Error cleaning up podcast {podcast_id}: {str(e)}")
